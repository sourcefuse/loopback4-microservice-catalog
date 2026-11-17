// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {
  type BenchFile,
  type SelectInput,
  dependencyPaths,
  main,
  selectFiles,
  staleLinks,
} from '../../cli/select';
import {benchLinks, takeLinks} from '../../functions/bench-links.function';
import {BenchmarkConfigError} from '../../errors';

const PKG = 'services/orders';
const LINKED: BenchFile = {
  path: 'dist/__tests__/benchmark/orders.benchmark.js',
  source: 'src/__tests__/benchmark/orders.benchmark.ts',
  links: ['src/services/order*.ts'],
};
const UNLINKED: BenchFile = {
  path: 'dist/__tests__/benchmark/app.benchmark.js',
  source: 'src/__tests__/benchmark/app.benchmark.ts',
};

function select(changed: string[], extra: Partial<SelectInput> = {}) {
  return selectFiles({
    packagePath: PKG,
    files: [LINKED, UNLINKED],
    changed,
    dependencyPaths: ['packages/core'],
    allGlobs: [],
    ...extra,
  });
}

describe('bench-select', () => {
  describe('selectFiles', () => {
    it('always runs a file without links', () => {
      expect([...select([]).keys()]).to.eql([UNLINKED.path]);
    });

    it('runs a linked file when a linked source changes', () => {
      const selection = select([`${PKG}/src/services/order.service.ts`]);

      expect(selection.get(LINKED.path)).to.match(/matches src\/services/);
    });

    it('skips a linked file when an unlinked source changes', () => {
      expect(
        select([`${PKG}/src/services/user.service.ts`]).has(LINKED.path),
      ).to.be.false();
    });

    it('runs a linked file when the file itself changes', () => {
      const selection = select([`${PKG}/${LINKED.source}`]);

      expect(selection.get(LINKED.path)).to.equal('the benchmark file changed');
    });

    it('runs every file for a package file outside src', () => {
      expect(select([`${PKG}/package.json`]).size).to.equal(2);
    });

    it('runs every file for a test helper', () => {
      expect(select([`${PKG}/src/__tests__/fixtures/seed.ts`]).size).to.equal(
        2,
      );
    });

    it('ignores spec files of other test types and Markdown', () => {
      const selection = select([
        `${PKG}/src/__tests__/unit/order.unit.ts`,
        `${PKG}/README.md`,
        'README.md',
      ]);

      expect(selection.has(LINKED.path)).to.be.false();
    });

    it('runs every file for a root file or a dependency', () => {
      expect(select(['package-lock.json']).size).to.equal(2);
      expect(select(['packages/core/src/index.ts']).size).to.equal(2);
    });

    it('ignores other workspaces', () => {
      expect(
        select(['services/users/src/index.ts']).has(LINKED.path),
      ).to.be.false();
    });

    it('runs every file for an --all glob', () => {
      const selection = select(['.github/workflows/bench.yml'], {
        allGlobs: ['.github/**'],
      });

      expect(selection.size).to.equal(2);
    });
  });

  describe('staleLinks', () => {
    it('reports a link that matches no file', () => {
      const files = [{...LINKED, links: ['src/services/gone.ts']}];

      expect(staleLinks(files, ['src/services/order.service.ts'])).to.eql([
        `${LINKED.source}: src/services/gone.ts`,
      ]);
    });
  });

  describe('dependencyPaths', () => {
    let root: string;

    function givenManifest(dir: string, manifest: object) {
      const file = join(root, dir, 'package.json');
      mkdirSync(dirname(file), {recursive: true});
      writeFileSync(file, JSON.stringify(manifest));
    }

    beforeEach(() => {
      root = mkdtempSync(join(tmpdir(), 'benchmarking-select-'));
    });

    afterEach(() => {
      rmSync(root, {recursive: true, force: true});
    });

    it('follows workspace dependencies transitively, for both entry forms', () => {
      givenManifest('.', {workspaces: ['services/*', 'packages/core/']});
      givenManifest(PKG, {name: 'orders', dependencies: {core: '1'}});
      givenManifest('packages/core', {name: 'core', dependencies: {util: '1'}});
      givenManifest('services/util', {name: 'util'});
      givenManifest('services/other', {name: 'other'});

      expect(dependencyPaths(root, PKG)).to.eql([
        'packages/core',
        'services/util',
      ]);
    });
  });
});

describe('bench-select main', () => {
  const LINKS_MODULE = join(__dirname, '../../functions/bench-links.function');
  const cwd = process.cwd();
  let root: string;
  let printed: sinon.SinonStub;

  /** Writes a source file and its built file, which runs `body`. */
  function givenBenchmark(name: string, body: string): string {
    const built = `dist/__tests__/benchmark/${name}.benchmark.js`;
    givenFile(`pkg/src/__tests__/benchmark/${name}.benchmark.ts`, '');
    givenFile(`pkg/${built}`, body);
    return built;
  }

  function givenFile(path: string, content: string): string {
    const file = join(root, path);
    mkdirSync(dirname(file), {recursive: true});
    writeFileSync(file, content);
    return file;
  }

  async function selectFor(changed: string[], files: string[]) {
    const list = givenFile('changed.txt', changed.join('\n'));
    const code = await main(['--changed', list, '--root', root, ...files]);
    return {code, selected: printed.args.map(([path]) => path as string)};
  }

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'benchmarking-select-main-'));
    givenFile('pkg/src/a.ts', '');
    process.chdir(join(root, 'pkg'));
    printed = sinon.stub(console, 'info');
    sinon.stub(process.stderr, 'write');
    takeLinks();
  });

  afterEach(() => {
    sinon.restore();
    process.chdir(cwd);
    rmSync(root, {recursive: true, force: true});
  });

  it('reads bench.links from the loaded files and selects by them', async () => {
    const linked = givenBenchmark(
      'linked',
      `require(${JSON.stringify(LINKS_MODULE)}).benchLinks('src/a.ts');`,
    );
    const unlinked = givenBenchmark('unlinked', '');

    expect(await selectFor(['pkg/src/a.ts'], [linked, unlinked])).to.eql({
      code: 0,
      selected: [linked, unlinked],
    });
  });

  it('skips a linked file when no link matches the change', async () => {
    const linked = givenBenchmark(
      'linked',
      `require(${JSON.stringify(LINKS_MODULE)}).benchLinks('src/a.ts');`,
    );
    const unlinked = givenBenchmark('unlinked', '');

    expect(await selectFor(['pkg/src/b.ts'], [linked, unlinked])).to.eql({
      code: 0,
      selected: [unlinked],
    });
  });

  it('exits 2 when a file does not load', async () => {
    const broken = givenBenchmark('broken', 'throw new Error("boom");');

    expect((await selectFor([], [broken])).code).to.equal(2);
  });

  it('exits 2 on bad usage', async () => {
    expect(await main(['--wrong'])).to.equal(2);
  });
});

describe('bench.links', () => {
  // Other loaded test files, such as the self benchmark, add links too.
  beforeEach(() => takeLinks());
  afterEach(() => takeLinks());

  it('collects the globs until they are taken', () => {
    benchLinks('src/a.ts', 'src/b/**');

    expect(takeLinks()).to.eql(['src/a.ts', 'src/b/**']);
    expect(takeLinks()).to.eql([]);
  });

  it('rejects globs that never match', () => {
    expect(() => benchLinks('!src/a.ts')).to.throw(BenchmarkConfigError);
    expect(() => benchLinks('./src/a.ts')).to.throw(BenchmarkConfigError);
  });
});
