// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {createCompactFilter} from '../../../../engine/artillery/compact';

/** The line that the expect plugin prints with `outputFormat: json`. */
function expectLine(url: string, ok = false, type = 'statusCode'): string {
  return JSON.stringify({
    name: 'n',
    url,
    results: [{ok, type, expected: 200, got: ok ? 200 : 429}],
  });
}

function run(lines: string[]): {out: string[]; summary?: string} {
  const filter = createCompactFilter();
  return {
    out: lines.flatMap(line => filter.accept(line)),
    summary: filter.summary(),
  };
}

describe('createCompactFilter', () => {
  it('prints nothing for a passing check, and passes other lines', () => {
    const {out, summary} = run([expectLine('/a', true), 'some line']);

    expect(out).to.eql(['some line']);
    expect(summary).to.be.undefined();
  });

  it('prints a failed request once and counts the repeats', () => {
    const line = expectLine('/a');
    const {out, summary} = run([line, line, line]);

    expect(out).to.eql([line]);
    expect(summary).to.equal('+2 more failed requests');
  });

  it('prints three different failures and counts the rest', () => {
    const urls = ['/a', '/b', '/c', '/d', '/e'];
    const {out, summary} = run(urls.map(url => expectLine(url)));

    expect(out).to.eql(urls.slice(0, 3).map(url => expectLine(url)));
    expect(summary).to.equal('+2 more failed requests');
  });

  it('drops a passing line between the lines of a failed request', () => {
    const lines = [
      expectLine('/a'),
      'Phase line',
      expectLine('/a', true),
      expectLine('/a'),
    ];
    const {out} = run(lines);

    expect(out).to.eql([expectLine('/a'), 'Phase line']);
  });

  it('passes a line that only looks like JSON', () => {
    const {out} = run(['{"broken', '{"a":1}']);

    expect(out).to.eql(['{"broken', '{"a":1}']);
  });

  it('prints the first 3 different Error lines and counts the rest', () => {
    const lines = ['a', 'b', 'c', 'd', 'a', 'a'].map(x => `Error: ${x}`);
    const {out, summary} = run(lines);

    expect(out).to.eql(['Error: a', 'Error: b', 'Error: c']);
    expect(summary).to.equal('+3 more error lines');
  });

  it('counts the error lines that the json format prints', () => {
    const line = (error: string) => JSON.stringify({ok: false, error});
    const {out, summary} = run(
      ['a', 'b', 'c', 'd', 'a'].map(error => line(error)),
    );

    expect(out).to.eql(['a', 'b', 'c'].map(error => line(error)));
    expect(summary).to.equal('+2 more error lines');
  });
});
