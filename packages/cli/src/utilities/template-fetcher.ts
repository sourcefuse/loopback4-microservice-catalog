// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {spawnSync} from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface TemplateFetchOptions {
  repo: string;
  targetDir: string;
  branch?: string;
  removeGit?: boolean;
}

export class TemplateFetcher {
  /**
   * Validate repository name to prevent injection attacks
   */
  private validateRepo(repo: string): void {
    // Only allow alphanumeric, hyphens, underscores, and forward slash for org/repo format
    const validRepoPattern = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
    if (!validRepoPattern.test(repo)) {
      throw new Error(
        `Invalid repository format: ${repo}. Expected format: org/repo`,
      );
    }
  }

  /**
   * Validate branch name to prevent injection attacks
   */
  private validateBranch(branch: string): void {
    // Only allow alphanumeric, hyphens, underscores, dots, and forward slashes
    const validBranchPattern = /^[a-zA-Z0-9._/-]+$/;
    if (!validBranchPattern.test(branch)) {
      throw new Error(`Invalid branch name: ${branch}`);
    }
  }

  /**
   * Fetch template from GitHub repository with security and fallback for default branch
   */
  async fetchFromGitHub(options: TemplateFetchOptions): Promise<void> {
    const {repo, targetDir, branch, removeGit = true} = options;

    this.validateInputs(repo, branch);
    this.validateTargetDirectory(targetDir);

    const branchesToTry = branch ? [branch] : ['main', 'master'];
    const cloneResult = this.attemptClone(repo, targetDir, branchesToTry);

    if (!cloneResult.success) {
      throw new Error(
        `Failed to clone template from ${repo}. Tried branches: ${branchesToTry.join(', ')}. Last error: ${cloneResult.error?.message}`,
      );
    }

    if (removeGit) {
      this.removeGitDirectory(targetDir);
    }

    // sonar-ignore: User feedback console statement
    console.log(`✅ Template fetched successfully`);
  }

  /**
   * Validate repository and branch inputs
   */
  private validateInputs(repo: string, branch?: string): void {
    this.validateRepo(repo);
    if (branch) {
      this.validateBranch(branch);
    }
  }

  /**
   * Validate target directory doesn't exist
   */
  private validateTargetDirectory(targetDir: string): void {
    if (fs.existsSync(targetDir)) {
      throw new Error(`Directory ${targetDir} already exists`);
    }
  }

  /**
   * Attempt to clone repository with multiple branches
   */
  private attemptClone(
    repo: string,
    targetDir: string,
    branchesToTry: string[],
  ): {success: boolean; error?: Error} {
    let lastError: Error | undefined;

    for (const branchName of branchesToTry) {
      const result = this.tryCloneBranch(repo, targetDir, branchName);
      if (result.success) {
        return {success: true};
      }
      lastError = result.error;
      this.cleanupFailedClone(targetDir);
    }

    return {success: false, error: lastError};
  }

  /**
   * Try cloning a specific branch
   */
  private tryCloneBranch(
    repo: string,
    targetDir: string,
    branchName: string,
  ): {success: boolean; error?: Error} {
    try {
      // sonar-ignore: User feedback console statement
      console.log(`Cloning template from ${repo} (branch: ${branchName})...`);

      // sonar-ignore: Using system PATH is required for CLI tool execution
      const result = spawnSync(
        'git',
        [
          'clone',
          '--depth',
          '1',
          '--branch',
          branchName,
          `https://github.com/${repo}.git`,
          targetDir,
        ],
        {stdio: 'inherit'},
      );

      if (result.status === 0) {
        return {success: true};
      }

      return {
        success: false,
        error: new Error(`Git clone failed with status ${result.status}`),
      };
    } catch (error) {
      return {success: false, error: error as Error};
    }
  }

  /**
   * Clean up failed clone directory
   */
  private cleanupFailedClone(targetDir: string): void {
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, {recursive: true, force: true});
    }
  }

  /**
   * Remove .git directory from cloned repository
   */
  private removeGitDirectory(targetDir: string): void {
    const gitDir = path.join(targetDir, '.git');
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, {recursive: true, force: true});
    }
  }

  /**
   * Copy template from local directory (for development)
   */
  async fetchFromLocal(sourcePath: string, targetDir: string): Promise<void> {
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source directory ${sourcePath} does not exist`);
    }

    if (fs.existsSync(targetDir)) {
      throw new Error(`Directory ${targetDir} already exists`);
    }

    // sonar-ignore: User feedback console statement
    console.log(`Copying template from ${sourcePath}...`);

    try {
      fs.cpSync(sourcePath, targetDir, {
        recursive: true,
        filter: (source: string) => {
          // Exclude node_modules, .git, and other unnecessary files
          const exclude = [
            'node_modules',
            '.git',
            'dist',
            'lib',
            'build',
            '.DS_Store',
          ];
          const baseName = path.basename(source);
          return !exclude.includes(baseName);
        },
      });

      // sonar-ignore: User feedback console statement
      console.log(`✅ Template copied successfully`);
    } catch (error) {
      throw new Error(`Failed to copy template: ${error}`);
    }
  }

  /**
   * Smart fetch - checks for local development environment first
   */
  async smartFetch(options: {
    repo: string;
    targetDir: string;
    branch?: string;
    localPath?: string;
  }): Promise<void> {
    const {repo, targetDir, branch, localPath} = options;

    // Check if local path exists (development mode)
    if (localPath && fs.existsSync(localPath)) {
      // sonar-ignore: User feedback console statement
      console.log('🔧 Development mode: using local template');
      await this.fetchFromLocal(localPath, targetDir);
    } else {
      // Production mode: clone from GitHub
      // sonar-ignore: User feedback console statement
      console.log('📦 Production mode: cloning from GitHub');
      await this.fetchFromGitHub({repo, targetDir, branch});
    }
  }
}
