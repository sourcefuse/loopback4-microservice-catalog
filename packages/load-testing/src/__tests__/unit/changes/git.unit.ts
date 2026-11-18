// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {changesSince} from '../../../changes/git';

describe('changesSince', () => {
  let repo: string;

  const git = (...args: string[]) =>
    execFileSync('git', args, {cwd: repo, stdio: 'pipe'});
  const write = (file: string, content = 'x') => {
    fs.mkdirSync(path.dirname(path.join(repo, file)), {recursive: true});
    fs.writeFileSync(path.join(repo, file), content);
  };
  const commit = (message: string) => {
    git('add', '-A');
    git('commit', '-q', '-m', message);
  };

  beforeEach(() => {
    repo = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'since-')));
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 't@t');
    git('config', 'user.name', 't');
    git('config', 'commit.gpgsign', 'false');
    write('package.json', '{"workspaces":["facades/*"]}');
    write('facades/a/package.json', '{}');
    write('facades/a/src/a.ts');
    write('services/s/src/s.ts');
    commit('base');
  });

  afterEach(() => fs.rmSync(repo, {recursive: true, force: true}));

  it('lists the files that changed after the ref, from the workspace root', () => {
    write('services/s/src/s.ts', 'y');
    write('docs/new.md');
    commit('change');

    const changes = changesSince(path.join(repo, 'facades/a'), 'HEAD~1');

    expect(changes.root).to.equal(repo);
    expect(changes.files.sort()).to.deepEqual([
      'docs/new.md',
      'services/s/src/s.ts',
    ]);
    expect(changes.tracked).to.containDeep(['facades/a/src/a.ts']);
  });

  it('diffs from the merge-base, so a change on the ref side does not count', () => {
    git('checkout', '-q', '-b', 'feature');
    write('facades/a/src/own.ts');
    commit('feature');
    git('checkout', '-q', 'main');
    write('services/s/src/other.ts');
    commit('main moves on');
    git('checkout', '-q', 'feature');

    const changes = changesSince(path.join(repo, 'facades/a'), 'main');

    expect(changes.files).to.deepEqual(['facades/a/src/own.ts']);
  });

  it('gives both paths of a rename', () => {
    git('mv', 'services/s/src/s.ts', 'services/s/src/t.ts');
    commit('rename');

    const {files} = changesSince(path.join(repo, 'facades/a'), 'HEAD~1');

    expect(files.sort()).to.deepEqual([
      'services/s/src/s.ts',
      'services/s/src/t.ts',
    ]);
  });

  it('ignores uncommitted and untracked files', () => {
    write('facades/a/src/a.ts', 'dirty');
    write('facades/a/src/untracked.ts');

    expect(
      changesSince(path.join(repo, 'facades/a'), 'HEAD').files,
    ).to.deepEqual([]);
  });

  it('uses the git root when no folder above the package has workspaces', () => {
    write('package.json', '{}');
    commit('no workspaces');

    expect(changesSince(path.join(repo, 'facades/a'), 'HEAD').root).to.equal(
      repo,
    );
    write('facades/package.json', '{"workspaces":[]}');
    commit('nearer workspaces');
    expect(changesSince(path.join(repo, 'facades/a'), 'HEAD').root).to.equal(
      path.join(repo, 'facades'),
    );
  });

  it('works from a git worktree', () => {
    write('services/s/src/s.ts', 'y');
    commit('change');
    const worktree = `${repo}-worktree`;
    git('worktree', 'add', '-q', worktree, 'HEAD');
    try {
      const changes = changesSince(
        path.join(fs.realpathSync(worktree), 'facades/a'),
        'HEAD~1',
      );

      expect(changes.files).to.deepEqual(['services/s/src/s.ts']);
    } finally {
      fs.rmSync(worktree, {recursive: true, force: true});
    }
  });

  it('drops a file outside the workspace root, and keeps one whose name starts with two dots', () => {
    write('facades/package.json', '{"workspaces":[]}');
    commit('nearer workspaces');
    write('services/s/src/s.ts', 'y');
    write('facades/..odd', 'y');
    commit('change');

    const changes = changesSince(path.join(repo, 'facades/a'), 'HEAD~1');

    expect(changes.root).to.equal(path.join(repo, 'facades'));
    expect(changes.files).to.deepEqual(['..odd']);
  });

  it('stops with a ConfigError that names an unknown ref', () => {
    expect(() =>
      changesSince(path.join(repo, 'facades/a'), 'no-such-ref'),
    ).to.throw({name: 'ConfigError', message: /--since no-such-ref/});
  });
});
