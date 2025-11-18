// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import {BaseGenerator} from '../../base-generator';
import {AnyObject} from '../../types';

export interface ReactGenerateOptions extends AnyObject {
  name: string;
  type: 'component' | 'hook' | 'context' | 'page' | 'service' | 'util' | 'slice';
  path?: string;
  skipTests?: boolean;
}

export default class ReactGenerator extends BaseGenerator<ReactGenerateOptions> {
  constructor(
    public args: string[],
    public opts: ReactGenerateOptions,
  ) {
    super(args, opts);
  }

  async prompting() {
    // Prompt for name if not provided
    if (!this.options.name) {
      const answer = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter artifact name',
          validate: (input: string) => input.length > 0 || 'Name is required',
        },
      ]);
      this.options.name = answer.name;
    }

    // Prompt for type if not provided
    if (!this.options.type) {
      const answer = await this.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Select artifact type',
          choices: [
            'component',
            'hook',
            'context',
            'page',
            'service',
            'util',
            'slice',
          ],
        },
      ]);
      this.options.type = answer.type;
    }
  }

  async writing() {
    const {name, type, path: targetPath, skipTests} = this.options;
    const dir = targetPath ?? this.getDefaultDir(type);

    switch (type) {
      case 'component':
        await this.generateComponent(name, dir, skipTests);
        break;
      case 'hook':
        await this.generateHook(name, dir, skipTests);
        break;
      case 'context':
        await this.generateContext(name, dir);
        break;
      case 'page':
        await this.generatePage(name, dir, skipTests);
        break;
      case 'service':
        await this.generateService(name, dir, skipTests);
        break;
      case 'util':
        await this.generateUtil(name, dir, skipTests);
        break;
      case 'slice':
        await this.generateSlice(name, dir);
        break;
      default:
        throw new Error(`Unsupported artifact type: ${type}`);
    }
  }

  private getDefaultDir(type: string): string {
    const dirs: Record<string, string> = {
      component: 'src/Components',
      hook: 'src/Hooks',
      context: 'src/Providers',
      page: 'src/Pages',
      slice: 'src/redux',
      service: 'src',
      util: 'src',
    };
    return dirs[type] || 'src';
  }

  private async generateComponent(name: string, dir: string, skipTests?: boolean) {
    const componentName = this.toPascalCase(name);
    const targetDir = this.destinationPath(dir, componentName);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('component.tsx.ejs'),
      this.destinationPath(targetDir, `${componentName}.tsx`),
      {componentName},
    );

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('index.ts.ejs'),
      this.destinationPath(targetDir, 'index.ts'),
      {componentName},
    );

    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
        this.templatePath('component.test.tsx.ejs'),
        this.destinationPath(targetDir, `${componentName}.test.tsx`),
        {componentName},
      );
    }
  }

  private async generateHook(name: string, dir: string, skipTests?: boolean) {
    const hookName = name.startsWith('use') ? name : `use${this.toPascalCase(name)}`;
    const targetDir = this.destinationPath(dir);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('hook.ts.ejs'),
      this.destinationPath(targetDir, `${hookName}.ts`),
      {hookName},
    );

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('index.ts.ejs'),
      this.destinationPath(targetDir, 'index.ts'),
      {name: hookName},
    );

    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
        this.templatePath('hook.test.ts.ejs'),
        this.destinationPath(targetDir, `${hookName}.test.ts`),
        {hookName},
      );
    }
  }

  private async generateContext(name: string, dir: string) {
    const contextName = this.toPascalCase(name);
    const targetDir = this.destinationPath(dir, `${contextName}Context`);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('context.tsx.ejs'),
      this.destinationPath(targetDir, `${contextName}Context.tsx`),
      {contextName},
    );

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('index.ts.ejs'),
      this.destinationPath(targetDir, 'index.ts'),
      {name: `${contextName}Context`},
    );
  }

  private async generatePage(name: string, dir: string, skipTests?: boolean) {
    const pageName = this.toPascalCase(name);
    const targetDir = this.destinationPath(dir, name);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('page.tsx.ejs'),
      this.destinationPath(targetDir, `${pageName}.tsx`),
      {pageName},
    );

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('index.ts.ejs'),
      this.destinationPath(targetDir, 'index.ts'),
      {name: pageName},
    );

    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
        this.templatePath('page.test.tsx.ejs'),
        this.destinationPath(targetDir, `${pageName}.test.tsx`),
        {pageName},
      );
    }
  }

  private async generateService(name: string, dir: string, skipTests?: boolean) {
    const serviceName = this.toPascalCase(name) + 'Service';
    const targetDir = this.destinationPath(dir);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('service.ts.ejs'),
      this.destinationPath(targetDir, `${name}.service.ts`),
      {serviceName, instanceName: this.toCamelCase(name) + 'Service'},
    );

    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
        this.templatePath('service.test.ts.ejs'),
        this.destinationPath(targetDir, `${name}.service.test.ts`),
        {serviceName, fileName: name},
      );
    }
  }

  private async generateUtil(name: string, dir: string, skipTests?: boolean) {
    const targetDir = this.destinationPath(dir);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('util.ts.ejs'),
      this.destinationPath(targetDir, `${name}.ts`),
      {name},
    );

    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
        this.templatePath('util.test.ts.ejs'),
        this.destinationPath(targetDir, `${name}.test.ts`),
        {name},
      );
    }
  }

  private async generateSlice(name: string, dir: string) {
    const sliceName = this.toCamelCase(name);
    const typeName = this.toPascalCase(name);
    const targetDir = this.destinationPath(dir, sliceName);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('slice.ts.ejs'),
      this.destinationPath(targetDir, `${sliceName}Slice.ts`),
      {sliceName, typeName},
    );

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('index.ts.ejs'),
      this.destinationPath(targetDir, 'index.ts'),
      {name: `${sliceName}Slice`},
    );
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  }

  private toCamelCase(str: string): string {
    const p = this.toPascalCase(str);
    return p.charAt(0).toLowerCase() + p.slice(1);
  }
}
