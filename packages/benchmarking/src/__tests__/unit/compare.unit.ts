// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {
  compareReports,
  confirmRegressions,
  main,
  suspectsOf,
  toMarkdown,
  toText,
} from '../../cli/compare';
import type {RunFile} from '../../types';

function runs(history: number[], test = 'creates'): RunFile {
  return {orders: {[test]: {history}}};
}

describe('bench-compare', () => {
  const saved = {...process.env};

  beforeEach(() => {
    for (const key of Object.keys(process.env)) {
      if (key.startsWith('BENCH_')) delete process.env[key];
    }
  });

  afterEach(() => {
    process.env = {...saved};
    sinon.restore();
  });

  describe('compareReports', () => {
    it('flags head slower than base past the threshold', () => {
      const {rows} = compareReports(runs([100, 100]), runs([80, 80]));

      expect(rows[0]).to.containEql({deviation: -20, status: 'REGRESSION'});
    });

    it('passes a drop inside the threshold', () => {
      const {rows} = compareReports(runs([100, 100]), runs([90, 90]));

      expect(rows[0].status).to.equal('OK');
    });

    it('flags head faster than base past the threshold', () => {
      const {rows} = compareReports(runs([100, 100]), runs([120, 120]));

      expect(rows[0].status).to.equal('IMPROVEMENT');
    });

    it('counts a base that did nothing as a regression', () => {
      const {rows} = compareReports(runs([0, 0]), runs([100]));

      expect(rows[0].status).to.equal('REGRESSION');
    });

    it('lists benchmarks that only one side has', () => {
      const result = compareReports(runs([100], 'old'), runs([100], 'new'));

      expect(result.onlyInBase).to.eql(['orders › old']);
      expect(result.onlyInHead).to.eql(['orders › new']);
      expect(result.rows).to.be.empty();
    });

    it('sorts the worst deviation first', () => {
      const base = {orders: {a: {history: [100]}, b: {history: [100]}}};
      const head = {orders: {a: {history: [110]}, b: {history: [70]}}};

      expect(compareReports(base, head).rows.map(row => row.test)).to.eql([
        'b',
        'a',
      ]);
    });
  });

  describe('suspects and re-check', () => {
    it('suspects a benchmark slower than half its threshold', () => {
      const result = compareReports(runs([100]), runs([92]));

      expect(suspectsOf(result)).to.have.length(1);
    });

    it('marks a regression that does not repeat as unconfirmed', () => {
      const first = compareReports(runs([100]), runs([80]));
      const second = compareReports(runs([100]), runs([99]));

      const row = confirmRegressions(first, second).rows[0];

      expect(row.status).to.equal('UNCONFIRMED');
      expect(row.recheckDeviation).to.equal(-1);
    });

    it('keeps a regression that repeats', () => {
      const first = compareReports(runs([100]), runs([80]));

      expect(confirmRegressions(first, first).rows[0].status).to.equal(
        'REGRESSION',
      );
    });
  });

  describe('output', () => {
    it('writes a Markdown summary and table', () => {
      const markdown = toMarkdown(compareReports(runs([100]), runs([80])));

      expect(markdown).to.match(/^\*\*1 regressions, 0 improvements/);
      expect(markdown).to.containEql('| REGRESSION | orders | creates |');
    });

    it('counts the benchmarks missing from head in the Markdown headline', () => {
      const markdown = toMarkdown(
        compareReports(runs([100], 'old'), runs([100])),
      );

      expect(markdown).to.containEql('1 missing from head (fails)');
    });

    it('escapes | in Markdown cells', () => {
      const markdown = toMarkdown(
        compareReports(runs([100], 'a|b'), runs([50], 'a|b')),
      );

      expect(markdown).to.containEql('| a\\|b |');
    });

    it('names the benchmarks missing from head in text', () => {
      const text = toText(compareReports(runs([100], 'old'), runs([100])));

      expect(text).to.containEql('Missing from head: orders › old');
    });
  });

  describe('main', () => {
    let workDir: string;

    function givenFile(name: string, data: RunFile): string {
      const file = join(workDir, name);
      writeFileSync(file, JSON.stringify(data));
      return file;
    }

    beforeEach(() => {
      workDir = mkdtempSync(join(tmpdir(), 'benchmarking-compare-'));
      sinon.stub(console, 'info');
      sinon.stub(process.stderr, 'write');
    });

    afterEach(() => {
      rmSync(workDir, {recursive: true, force: true});
    });

    it('exits 0 without a regression', () => {
      const base = givenFile('base.json', runs([100]));
      const head = givenFile('head.json', runs([100]));

      expect(main([base, head])).to.equal(0);
    });

    it('exits 1 on a regression', () => {
      const base = givenFile('base.json', runs([100]));
      const head = givenFile('head.json', runs([50]));

      expect(main([base, head])).to.equal(1);
    });

    it('exits 1 when a benchmark is missing from head', () => {
      const base = givenFile('base.json', runs([100], 'old'));
      const head = givenFile('head.json', runs([100]));

      expect(main([base, head])).to.equal(1);
    });

    it('exits 0 when the re-check does not repeat the regression', () => {
      const files = [
        givenFile('base.json', runs([100])),
        givenFile('head.json', runs([50])),
        givenFile('base-recheck.json', runs([100])),
        givenFile('head-recheck.json', runs([100])),
      ];

      expect(main(files)).to.equal(0);
    });

    it('exits 1 when a side is not a number', () => {
      const base = givenFile('base.json', runs([100]));
      const head = givenFile('head.json', {
        orders: {creates: {history: [null as unknown as number]}},
      });

      expect(main([base, head])).to.equal(1);
    });

    it('exits 2 on bad usage', () => {
      expect(main(['only-one.json'])).to.equal(2);
    });

    it('exits 2 when nothing could be compared', () => {
      const base = givenFile('base.json', runs([]));
      const head = givenFile('head.json', runs([100]));

      expect(main([base, head])).to.equal(2);
    });

    it('throws for an entry without a history array', () => {
      const base = givenFile('base.json', {s: {a: 5}} as unknown as RunFile);
      const head = givenFile('head.json', runs([100]));

      expect(() => main([base, head])).to.throw(/s › a has no history/);
    });

    it('exits 2 on an unknown flag', () => {
      const base = givenFile('base.json', runs([100]));
      const head = givenFile('head.json', runs([100]));

      expect(main([base, head, '--markdwon'])).to.equal(2);
    });

    it('prints the usage and exits 0 for --help', () => {
      expect(main(['--help'])).to.equal(0);
    });

    it('throws for a missing run file', () => {
      expect(() =>
        main([join(workDir, 'a.json'), join(workDir, 'b.json')]),
      ).to.throw(/missing or holds no runs/);
    });
  });
});
