// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import * as fs from 'fs';
import * as path from 'path';

export interface GeneratorOptions {
  name: string;
  targetPath: string;
  skipTests?: boolean;
}

export class FileGenerator {
  /**
   * Write file to disk
   */
  protected writeFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Convert string to PascalCase
   */
  protected toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Convert string to camelCase
   */
  protected toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  /**
   * Convert string to kebab-case
   */
  protected toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Get project root by looking for package.json
   */
  protected getProjectRoot(startPath?: string): string {
    let currentPath = startPath || process.cwd();

    while (currentPath !== path.parse(currentPath).root) {
      const packageJsonPath = path.join(currentPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        return currentPath;
      }
      currentPath = path.dirname(currentPath);
    }

    // If not found, use current working directory
    return process.cwd();
  }

  /**
   * Update package.json with new name
   */
  updatePackageJson(projectPath: string, projectName: string): void {
    const packageJsonPath = path.join(projectPath, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      console.warn('⚠️  package.json not found');
      return;
    }

    try {
      const packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, 'utf-8'),
      );
      packageJson.name = projectName;
      packageJson.version = '1.0.0';

      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        'utf-8',
      );

      console.log('✅ package.json updated');
    } catch (error) {
      console.error('❌ Failed to update package.json:', error);
    }
  }

  /**
   * Remove module from project
   */
  removeModule(projectPath: string, moduleName: string): void {
    const modulePath = path.join(projectPath, 'src', moduleName);

    if (fs.existsSync(modulePath)) {
      fs.rmSync(modulePath, {recursive: true, force: true});
      console.log(`✅ Removed module: ${moduleName}`);
    }
  }

  /**
   * Install dependencies using npm
   */
  installDependencies(projectPath: string): void {
    console.log('📦 Installing dependencies...');
    const {execSync} = require('child_process');

    try {
      execSync('npm install', {
        cwd: projectPath,
        stdio: 'inherit',
      });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error);
    }
  }

  /**
   * Create directory if it doesn't exist
   */
  ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, {recursive: true});
    }
  }

  /**
   * Check if file exists
   */
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Read file content
   */
  readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Delete file or directory
   */
  delete(targetPath: string): void {
    if (fs.existsSync(targetPath)) {
      const stats = fs.statSync(targetPath);
      if (stats.isDirectory()) {
        fs.rmSync(targetPath, {recursive: true, force: true});
      } else {
        fs.unlinkSync(targetPath);
      }
    }
  }
}
