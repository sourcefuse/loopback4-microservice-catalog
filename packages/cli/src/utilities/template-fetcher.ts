import {spawnSync} from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface TemplateFetchOptions {
  repo: string;
  targetDir: string;
  branch?: string;
  removeGit?: boolean;
}

/**
 * Handles secure fetching of boilerplate templates
 * from GitHub or local development directories.
 */
export class TemplateFetcher {
  private static readonly REPO_PATTERN = /^[a-zA-Z0-9-]+\/[a-zA-Z0-9.-]+$/;
  private static readonly BRANCH_PATTERN = /^[a-zA-Z0-9._/-]+$/;

  private validateRepo(repo: string): void {
    if (!TemplateFetcher.REPO_PATTERN.test(repo)) {
      throw new Error(`Invalid repository format: ${repo}. Expected: org/repo`);
    }
  }

  private validateBranch(branch: string): void {
    if (!TemplateFetcher.BRANCH_PATTERN.test(branch)) {
      throw new Error(`Invalid branch name: ${branch}`);
    }
  }

  private validateInputs(repo: string, branch?: string): void {
    this.validateRepo(repo);
    if (branch) this.validateBranch(branch);
  }

  private ensureTargetDirNotExists(targetDir: string): void {
    if (fs.existsSync(targetDir)) {
      throw new Error(`Target directory already exists: ${targetDir}`);
    }
  }

  async fetchFromGitHub(options: TemplateFetchOptions): Promise<void> {
    const {repo, targetDir, branch, removeGit = true} = options;
    this.validateInputs(repo, branch);
    this.ensureTargetDirNotExists(targetDir);

    const branches = branch ? [branch] : ['main', 'master'];
    const result = this.tryBranches(repo, targetDir, branches);

    if (!result.success) {
      throw new Error(
        `Failed to clone ${repo}. Tried: ${branches.join(', ')}. Last error: ${
          result.error?.message ?? 'unknown'
        }`,
      );
    }

    if (removeGit) this.removeGitDir(targetDir);
    console.log('✅ Template fetched successfully'); // NOSONAR
  }

  private tryBranches(
    repo: string,
    targetDir: string,
    branches: string[],
  ): {success: boolean; error?: Error} {
    let lastError: Error | undefined;

    for (const b of branches) {
      if (this.cloneBranch(repo, targetDir, b)) return {success: true};
      lastError = new Error(`Clone failed for branch: ${b}`);
      this.cleanupDir(targetDir);
    }

    return {success: false, error: lastError};
  }

  private cloneBranch(
    repo: string,
    targetDir: string,
    branch: string,
  ): boolean {
    console.log(`Cloning ${repo} (branch: ${branch})...`); // NOSONAR
    try {
      // NOSONAR: Safe usage - repo and branch are validated against strict patterns
      // (REPO_PATTERN and BRANCH_PATTERN) before reaching this method. All inputs
      // are sanitized and cannot contain shell injection characters.
      // sonarignore:start
      const result = spawnSync(
        'git',
        [
          'clone',
          '--depth',
          '1',
          '--branch',
          branch,
          `https://github.com/${repo}.git`,
          targetDir,
        ],
        {stdio: 'inherit'},
      );
      // sonarignore:end

      return result.status === 0;
    } catch (error) {
      console.warn(`Git clone failed: ${error}`); // NOSONAR
      return false;
    }
  }

  private cleanupDir(dir: string): void {
    if (fs.existsSync(dir)) fs.rmSync(dir, {recursive: true, force: true});
  }

  private removeGitDir(targetDir: string): void {
    const gitDir = path.join(targetDir, '.git');
    if (fs.existsSync(gitDir))
      fs.rmSync(gitDir, {recursive: true, force: true});
  }

  async fetchFromLocal(sourcePath: string, targetDir: string): Promise<void> {
    if (!fs.existsSync(sourcePath))
      throw new Error(`Source not found: ${sourcePath}`);
    this.ensureTargetDirNotExists(targetDir);

    console.log(`Copying from ${sourcePath}...`); // NOSONAR

    const exclude = new Set([
      'node_modules',
      '.git',
      'dist',
      'lib',
      'build',
      '.DS_Store',
    ]);

    try {
      fs.cpSync(sourcePath, targetDir, {
        recursive: true,
        filter: src => !exclude.has(path.basename(src)),
      });
      console.log('✅ Template copied successfully'); // NOSONAR
    } catch (error) {
      throw new Error(`Failed to copy template: ${String(error)}`);
    }
  }

  async smartFetch(options: {
    repo: string;
    targetDir: string;
    branch?: string;
    localPath?: string;
  }): Promise<void> {
    const {repo, targetDir, branch, localPath} = options;

    if (localPath && fs.existsSync(localPath)) {
      console.log('🔧 Using local template (development mode)'); // NOSONAR
      await this.fetchFromLocal(localPath, targetDir);
    } else {
      console.log('📦 Cloning from GitHub (production mode)'); // NOSONAR
      await this.fetchFromGitHub({repo, targetDir, branch});
    }
  }
}
