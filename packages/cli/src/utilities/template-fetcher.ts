// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {execSync} from 'child_process';
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
   * Fetch template from GitHub repository
   */
  async fetchFromGitHub(options: TemplateFetchOptions): Promise<void> {
    const {repo, targetDir, branch = 'master', removeGit = true} = options;

    // Check if target directory already exists
    if (fs.existsSync(targetDir)) {
      throw new Error(`Directory ${targetDir} already exists`);
    }

    console.log(`Cloning template from ${repo} (branch: ${branch})...`);

    try {
      // Clone repository
      execSync(
        `git clone --depth 1 --branch ${branch} https://github.com/${repo}.git ${targetDir}`,
        {stdio: 'inherit'},
      );

      // Remove .git directory if requested
      if (removeGit) {
        const gitDir = path.join(targetDir, '.git');
        if (fs.existsSync(gitDir)) {
          fs.rmSync(gitDir, {recursive: true, force: true});
        }
      }

      console.log(`✅ Template fetched successfully`);
    } catch (error) {
      throw new Error(`Failed to clone template: ${error}`);
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
