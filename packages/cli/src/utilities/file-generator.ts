import {execSync} from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

export class FileGenerator {
  protected writeFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  removeModule(projectPath: string, moduleName: string): void {
    try {
      const modulePath = path.join(projectPath, 'src', 'app', moduleName);
      if (fs.existsSync(modulePath)) {
        fs.rmSync(modulePath, {recursive: true, force: true});
        console.log(`🗑️  Removed module: ${moduleName}`); // NOSONAR
      } else {
        console.log(`ℹ️  Module not found: ${moduleName}`); // NOSONAR
      }
    } catch (err) {
      console.error(`❌ Failed to remove module '${moduleName}':`, err); // NOSONAR
    }
  }

  protected toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  }

  protected toCamelCase(str: string): string {
    const p = this.toPascalCase(str);
    return p.charAt(0).toLowerCase() + p.slice(1);
  }

  protected toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  protected getProjectRoot(startPath?: string): string {
    let current = startPath ?? process.cwd();
    while (current !== path.parse(current).root) {
      if (fs.existsSync(path.join(current, 'package.json'))) return current;
      current = path.dirname(current);
    }
    return process.cwd();
  }

  updatePackageJson(projectPath: string, projectName: string): void {
    const file = path.join(projectPath, 'package.json');
    if (!fs.existsSync(file)) {
      console.warn('⚠️  package.json not found'); // NOSONAR
      return;
    }
    try {
      const pkg = JSON.parse(fs.readFileSync(file, 'utf-8'));
      pkg.name = projectName;
      pkg.version = '1.0.0';
      fs.writeFileSync(file, JSON.stringify(pkg, null, 2), 'utf-8');
      console.log('✅ package.json updated'); // NOSONAR
    } catch (err) {
      console.error('❌ Failed to update package.json:', err); // NOSONAR
    }
  }

  installDependencies(projectPath: string): void {
    console.log('📦 Installing dependencies...'); // NOSONAR
    try {
      execSync('npm install', {cwd: projectPath, stdio: 'inherit'}); // NOSONAR
      console.log('✅ Dependencies installed successfully'); // NOSONAR
    } catch (err) {
      console.error('❌ Failed to install dependencies:', err); // NOSONAR
    }
  }

  ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, {recursive: true});
  }

  readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  delete(targetPath: string): void {
    if (!fs.existsSync(targetPath)) return;
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
      fs.rmSync(targetPath, {recursive: true, force: true});
    } else {
      fs.unlinkSync(targetPath);
    }
  }

  replaceInFiles(targetDir: string, search: string, replace: string): void {
    const walk = (dir: string): void => {
      const entries = fs.readdirSync(dir, {withFileTypes: true});
      for (const e of entries) {
        const filePath = path.join(dir, e.name);
        if (e.isDirectory()) walk(filePath);
        else if (e.isFile()) {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes(search)) {
            const newContent = content.split(search).join(replace);
            fs.writeFileSync(filePath, newContent, 'utf8');
          }
        } else continue;
      }
    };
    try {
      walk(targetDir);
    } catch (err) {
      console.warn(`replaceInFiles: failed for ${targetDir} - ${err}`); // NOSONAR
    }
  }
}
