// Copyright (c) 2023 Sourcefuse Technologies
// Released under the MIT License.
// https://opensource.org/licenses/MIT

import * as path from 'node:path';
import {BaseGenerator} from '../../base-generator';
import {AnyObject} from '../../types';

export interface AngularGenerateOptions extends AnyObject {
  name: string;
  type: 'component' | 'service' | 'module' | 'directive' | 'pipe' | 'guard';
  path?: string;
  project?: string;
  standalone?: boolean;
  skipTests?: boolean;
}

export default class AngularGenerator extends BaseGenerator<AngularGenerateOptions> {
  constructor(
    public args: string[],
    public opts: AngularGenerateOptions,
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
          message: 'What is the name of the artifact?',
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
          message: 'What type of artifact do you want to generate?',
          choices: [
            'component',
            'service',
            'module',
            'directive',
            'pipe',
            'guard',
          ],
        },
      ]);
      this.options.type = answer.type;
    }
  }

  async writing() {
    const {
      name,
      type,
      path: artifactPath,
      project = 'arc',
      standalone,
      skipTests,
    } = this.options;

    const projectRoot = process.cwd();
    const projectBasePath = path.join(projectRoot, 'projects', project, 'src');
    const appOrLib = project === 'arc-lib' ? 'lib' : 'app';
    const targetPath = artifactPath
      ? path.join(projectBasePath, appOrLib, artifactPath)
      : path.join(projectBasePath, appOrLib);

    switch (type) {
      case 'component':
        await this.generateComponent(name, targetPath, standalone, skipTests);
        break;
      case 'service':
        await this.generateService(name, targetPath, skipTests);
        break;
      case 'module':
        await this.generateModule(name, targetPath);
        break;
      case 'directive':
        await this.generateDirective(name, targetPath, skipTests);
        break;
      case 'pipe':
        await this.generatePipe(name, targetPath, skipTests);
        break;
      case 'guard':
        await this.generateGuard(name, targetPath, skipTests);
        break;
      default:
        throw new Error(`Unsupported artifact type: ${type}`);
    }
  }

  private async generateComponent(
    name: string,
    targetPath: string,
    standalone?: boolean,
    skipTests?: boolean,
  ) {
    const componentPath = path.join(targetPath, name);
    const className = this.toPascalCase(name) + 'Component';
    const selector = this.toKebabCase(name);

    // Component TypeScript file
    const templateName = standalone ? 'component-standalone.ts.ejs' : 'component.ts.ejs';
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath(templateName),
      this.destinationPath(componentPath, `${name}.component.ts`),
      {className, selector, name},
    );

    // HTML template
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('component.html.ejs'),
      this.destinationPath(componentPath, `${name}.component.html`),
      {selector, name},
    );

    // SCSS file
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('component.scss.ejs'),
      this.destinationPath(componentPath, `${name}.component.scss`),
      {selector},
    );

    // Spec file
    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyTplAsync(
        this.templatePath('component.spec.ts.ejs'),
        this.destinationPath(componentPath, `${name}.component.spec.ts`),
        {className, name},
      );
    }
  }

  private async generateService(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ) {
    const className = this.toPascalCase(name) + 'Service';

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('service.ts.ejs'),
      this.destinationPath(targetPath, `${name}.service.ts`),
      {className},
    );

    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyTplAsync(
        this.templatePath('service.spec.ts.ejs'),
        this.destinationPath(targetPath, `${name}.service.spec.ts`),
        {className, name},
      );
    }
  }

  private async generateModule(name: string, targetPath: string) {
    const modulePath = path.join(targetPath, name);
    const className = this.toPascalCase(name) + 'Module';

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('module.ts.ejs'),
      this.destinationPath(modulePath, `${name}.module.ts`),
      {className},
    );
  }

  private async generateDirective(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ) {
    const className = this.toPascalCase(name) + 'Directive';
    const selector = this.toCamelCase(name);
    const pascalSelector = this.toPascalCase(selector);
    const selectorName = `[app${pascalSelector}]`;

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('directive.ts.ejs'),
      this.destinationPath(targetPath, `${name}.directive.ts`),
      {className, selectorName},
    );

    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyTplAsync(
        this.templatePath('directive.spec.ts.ejs'),
        this.destinationPath(targetPath, `${name}.directive.spec.ts`),
        {className, name},
      );
    }
  }

  private async generatePipe(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ) {
    const className = this.toPascalCase(name) + 'Pipe';
    const pipeName = this.toCamelCase(name);

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('pipe.ts.ejs'),
      this.destinationPath(targetPath, `${name}.pipe.ts`),
      {className, pipeName},
    );

    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyTplAsync(
        this.templatePath('pipe.spec.ts.ejs'),
        this.destinationPath(targetPath, `${name}.pipe.spec.ts`),
        {className, name},
      );
    }
  }

  private async generateGuard(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ) {
    const className = this.toPascalCase(name) + 'Guard';

    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    //@ts-ignore
    await this.fs.copyTplAsync(
      this.templatePath('guard.ts.ejs'),
      this.destinationPath(targetPath, `${name}.guard.ts`),
      {className},
    );

    if (!skipTests) {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      //@ts-ignore
      await this.fs.copyTplAsync(
        this.templatePath('guard.spec.ts.ejs'),
        this.destinationPath(targetPath, `${name}.guard.spec.ts`),
        {className, name},
      );
    }
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

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
}
