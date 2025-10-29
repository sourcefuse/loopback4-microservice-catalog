// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {spawnSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

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

    // Validate inputs to prevent command injection
    this.validateRepo(repo);
    if (branch) {
      this.validateBranch(branch);
    }

    // Check if target directory already exists
    if (fs.existsSync(targetDir)) {
      throw new Error(`Directory ${targetDir} already exists`);
    }

    // Try specified branch first, then fallback to main/master
    const branchesToTry = branch ? [branch] : ['main', 'master'];
    let cloneSucceeded = false;
    let lastError: Error | undefined;

    for (const branchName of branchesToTry) {
      try {
        console.log(`Cloning template from ${repo} (branch: ${branchName})...`);

        // Use spawnSync with array arguments to prevent command injection
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
          cloneSucceeded = true;
          break;
        } else {
          lastError = new Error(
            `Git clone failed with status ${result.status}`,
          );
          // Clean up failed clone directory
          if (fs.existsSync(targetDir)) {
            fs.rmSync(targetDir, {recursive: true, force: true});
          }
        }
      } catch (error) {
        lastError = error as Error;
        // Clean up failed clone directory
        if (fs.existsSync(targetDir)) {
          fs.rmSync(targetDir, {recursive: true, force: true});
        }
      }
    }

    if (!cloneSucceeded) {
      throw new Error(
        `Failed to clone template from ${repo}. Tried branches: ${branchesToTry.join(', ')}. Last error: ${lastError?.message}`,
      );
    }

    // Remove .git directory if requested
    if (removeGit) {
      const gitDir = path.join(targetDir, '.git');
      if (fs.existsSync(gitDir)) {
        fs.rmSync(gitDir, {recursive: true, force: true});
      }
    }

    console.log(`✅ Template fetched successfully`);
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
      console.log('🔧 Development mode: using local template');
      await this.fetchFromLocal(localPath, targetDir);
    } else {
      // Production mode: clone from GitHub
      console.log('📦 Production mode: cloning from GitHub');
      await this.fetchFromGitHub({repo, targetDir, branch});
    }
  }
}
