// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import {IConfig} from '@oclif/config';
import * as path from 'path';
import Base from '../../command-base';
import {AnyObject, PromptFunction} from '../../types';
import {FileGenerator} from '../../utilities/file-generator';

export class AngularGenerate extends Base<{}> {
  private fileGenerator = new FileGenerator();

  static readonly description =
    'Generate Angular components, services, modules, and other artifacts';

  static readonly mcpDescription = `
    Use this command to generate Angular artifacts like components, services, modules, directives, pipes, and guards.
    The generated files follow Angular best practices and ARC boilerplate conventions.

    The boilerplate has a multi-project structure with these projects:
    - arc (main application - default)
    - arc-lib (shared library)
    - arc-docs (documentation)
    - saas-ui (SaaS UI application)

    Examples:
    - Generate a component: type=component, name=user-profile (defaults to projects/arc/src/app/)
    - Generate in arc-lib: type=component, name=button, project=arc-lib
    - Generate a service: type=service, name=auth, path=core/services
    - Generate a standalone component: type=component, name=button, standalone=true

    The command will create the necessary files in the specified project and path.
  `;

  static readonly mcpFlags = {
    workingDir: flags.string({
      name: 'workingDir',
      description: 'Path to the Angular project root directory',
      required: false,
    }),
  };

  static readonly flags = {
    help: flags.boolean({
      name: 'help',
      description: 'Show manual pages',
      type: 'boolean',
    }),
    type: flags.enum({
      name: 'type',
      description: 'Type of artifact to generate',
      options: ['component', 'service', 'module', 'directive', 'pipe', 'guard'],
      required: false,
    }),
    path: flags.string({
      name: 'path',
      description:
        'Path where the artifact should be generated (relative to project src/app)',
      required: false,
    }),
    project: flags.string({
      name: 'project',
      description: 'Angular project name (arc, arc-lib, arc-docs, saas-ui)',
      required: false,
      default: 'arc',
    }),
    standalone: flags.boolean({
      name: 'standalone',
      description: 'Generate as a standalone component (Angular 14+)',
      required: false,
    }),
    skipTests: flags.boolean({
      name: 'skipTests',
      description: 'Skip generating test files',
      required: false,
    }),
  };

  static readonly args = [
    {
      name: 'name',
      description: 'Name of the artifact to generate',
      required: false,
    },
  ];

  async run() {
    const parsed = this.parse(AngularGenerate);
    const name = parsed.args.name;
    const inputs = {name, ...parsed.flags};

    if (!inputs.name) {
      const answer = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of the artifact?',
          validate: (input: string) =>
            input.length > 0 || 'Name is required',
        },
      ]);
      inputs.name = answer.name;
    }

    if (!inputs.type) {
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
        } as Record<string, unknown>,
      ]);
      inputs.type = answer.type;
    }

    const result = await this.generateArtifact(inputs);
    this.log(result);
  }

  static async mcpRun(inputs: AnyObject) {
    const originalCwd = process.cwd();
    if (inputs.workingDir) {
      process.chdir(inputs.workingDir);
    }

    try {
      const generator = new AngularGenerate([], {} as unknown as IConfig, {} as unknown as PromptFunction);
      const result = await generator.generateArtifact(inputs);
      process.chdir(originalCwd);
      return {
        content: [{type: 'text' as const, text: result, isError: false}],
      };
    } catch (err) {
      process.chdir(originalCwd);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${err instanceof Error ? err.message : err}`,
            isError: true,
          },
        ],
      };
    }
  }

  private async generateArtifact(inputs: AnyObject): Promise<string> {
    const {
      name,
      type,
      path: artifactPath,
      project = 'arc',
      standalone,
      skipTests,
    } = inputs;
    const projectRoot = this.fileGenerator['getProjectRoot']();

    // Determine base path based on project
    const projectBasePath = path.join(projectRoot, 'projects', project, 'src');

    // For arc-lib, use lib/ instead of app/
    const appOrLib = project === 'arc-lib' ? 'lib' : 'app';

    // Determine the target path
    const targetPath = artifactPath
      ? path.join(projectBasePath, appOrLib, artifactPath)
      : path.join(projectBasePath, appOrLib);

    this.fileGenerator['ensureDirectory'](targetPath);

    const artifacts: string[] = [];

    switch (type) {
      case 'component':
        artifacts.push(
          ...this.generateComponent(name, targetPath, standalone, skipTests),
        );
        break;
      case 'service':
        artifacts.push(...this.generateService(name, targetPath, skipTests));
        break;
      case 'module':
        artifacts.push(...this.generateModule(name, targetPath));
        break;
      case 'directive':
        artifacts.push(...this.generateDirective(name, targetPath, skipTests));
        break;
      case 'pipe':
        artifacts.push(...this.generatePipe(name, targetPath, skipTests));
        break;
      case 'guard':
        artifacts.push(...this.generateGuard(name, targetPath, skipTests));
        break;
      default:
        throw new Error(`Unsupported artifact type: ${type}`);
    }

    return `✅ Successfully generated ${type} '${name}' at:\n${artifacts.map(f => `  - ${f}`).join('\n')}`;
  }

  private generateComponent(
    name: string,
    targetPath: string,
    standalone?: boolean,
    skipTests?: boolean,
  ): string[] {
    const componentPath = path.join(targetPath, name);
    this.fileGenerator['ensureDirectory'](componentPath);

    const className =
      this.fileGenerator['toPascalCase'](name) + 'Component';
    const selector = this.fileGenerator['toKebabCase'](name);
    const files: string[] = [];

    // Component TypeScript file
    const tsContent = standalone
      ? this.getStandaloneComponentTemplate(className, selector, name)
      : this.getComponentTemplate(className, selector, name);

    const tsFile = path.join(componentPath, `${name}.component.ts`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // HTML template
    const htmlContent = `<div class="${selector}">\n  <p>${name} works!</p>\n</div>\n`;
    const htmlFile = path.join(componentPath, `${name}.component.html`);
    this.fileGenerator['writeFile'](htmlFile, htmlContent);
    files.push(htmlFile);

    // SCSS file
    const scssContent = `.${selector} {\n  // Add your styles here\n}\n`;
    const scssFile = path.join(componentPath, `${name}.component.scss`);
    this.fileGenerator['writeFile'](scssFile, scssContent);
    files.push(scssFile);

    // Spec file
    if (!skipTests) {
      const specContent = this.getComponentSpecTemplate(className, name);
      const specFile = path.join(componentPath, `${name}.component.spec.ts`);
      this.fileGenerator['writeFile'](specFile, specContent);
      files.push(specFile);
    }

    return files;
  }

  private generateService(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const servicePath = targetPath;
    this.fileGenerator['ensureDirectory'](servicePath);

    const className = this.fileGenerator['toPascalCase'](name) + 'Service';
    const files: string[] = [];

    // Service TypeScript file
    const tsContent = this.getServiceTemplate(className);
    const tsFile = path.join(servicePath, `${name}.service.ts`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Spec file
    if (!skipTests) {
      const specContent = this.getServiceSpecTemplate(className, name);
      const specFile = path.join(servicePath, `${name}.service.spec.ts`);
      this.fileGenerator['writeFile'](specFile, specContent);
      files.push(specFile);
    }

    return files;
  }

  private generateModule(name: string, targetPath: string): string[] {
    const modulePath = path.join(targetPath, name);
    this.fileGenerator['ensureDirectory'](modulePath);

    const className = this.fileGenerator['toPascalCase'](name) + 'Module';
    const files: string[] = [];

    // Module TypeScript file
    const tsContent = this.getModuleTemplate(className);
    const tsFile = path.join(modulePath, `${name}.module.ts`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    return files;
  }

  private generateDirective(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const directivePath = targetPath;
    this.fileGenerator['ensureDirectory'](directivePath);

    const className = this.fileGenerator['toPascalCase'](name) + 'Directive';
    const selector = this.fileGenerator['toCamelCase'](name);
    const files: string[] = [];

    // Directive TypeScript file
    const tsContent = this.getDirectiveTemplate(className, selector);
    const tsFile = path.join(directivePath, `${name}.directive.ts`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Spec file
    if (!skipTests) {
      const specContent = this.getDirectiveSpecTemplate(className, name);
      const specFile = path.join(directivePath, `${name}.directive.spec.ts`);
      this.fileGenerator['writeFile'](specFile, specContent);
      files.push(specFile);
    }

    return files;
  }

  private generatePipe(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const pipePath = targetPath;
    this.fileGenerator['ensureDirectory'](pipePath);

    const className = this.fileGenerator['toPascalCase'](name) + 'Pipe';
    const pipeName = this.fileGenerator['toCamelCase'](name);
    const files: string[] = [];

    // Pipe TypeScript file
    const tsContent = this.getPipeTemplate(className, pipeName);
    const tsFile = path.join(pipePath, `${name}.pipe.ts`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Spec file
    if (!skipTests) {
      const specContent = this.getPipeSpecTemplate(className, name);
      const specFile = path.join(pipePath, `${name}.pipe.spec.ts`);
      this.fileGenerator['writeFile'](specFile, specContent);
      files.push(specFile);
    }

    return files;
  }

  private generateGuard(
    name: string,
    targetPath: string,
    skipTests?: boolean,
  ): string[] {
    const guardPath = targetPath;
    this.fileGenerator['ensureDirectory'](guardPath);

    const className = this.fileGenerator['toPascalCase'](name) + 'Guard';
    const files: string[] = [];

    // Guard TypeScript file
    const tsContent = this.getGuardTemplate(className);
    const tsFile = path.join(guardPath, `${name}.guard.ts`);
    this.fileGenerator['writeFile'](tsFile, tsContent);
    files.push(tsFile);

    // Spec file
    if (!skipTests) {
      const specContent = this.getGuardSpecTemplate(className, name);
      const specFile = path.join(guardPath, `${name}.guard.spec.ts`);
      this.fileGenerator['writeFile'](specFile, specContent);
      files.push(specFile);
    }

    return files;
  }

  // Template methods
  private getComponentTemplate(
    className: string,
    selector: string,
    name: string,
  ): string {
    return `import {Component} from '@angular/core';

@Component({
  selector: 'app-${selector}',
  templateUrl: './${name}.component.html',
  styleUrls: ['./${name}.component.scss']
})
export class ${className} {
  constructor() {}
}
`;
  }

  private getStandaloneComponentTemplate(
    className: string,
    selector: string,
    name: string,
  ): string {
    return `import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-${selector}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${name}.component.html',
  styleUrls: ['./${name}.component.scss']
})
export class ${className} {
  constructor() {}
}
`;
  }

  private getComponentSpecTemplate(className: string, name: string): string {
    return `import {ComponentFixture, TestBed} from '@angular/core/testing';
import {${className}} from './${name}.component';

describe('${className}', () => {
  let component: ${className};
  let fixture: ComponentFixture<${className}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [${className}]
    }).compileComponents();

    fixture = TestBed.createComponent(${className});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
`;
  }

  private getServiceTemplate(className: string): string {
    return `import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ${className} {
  constructor() {}
}
`;
  }

  private getServiceSpecTemplate(className: string, name: string): string {
    return `import {TestBed} from '@angular/core/testing';
import {${className}} from './${name}.service';

describe('${className}', () => {
  let service: ${className};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(${className});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
`;
  }

  private getModuleTemplate(className: string): string {
    return `import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: []
})
export class ${className} {}
`;
  }

  private getDirectiveTemplate(className: string, selector: string): string {
    return `import {Directive} from '@angular/core';

@Directive({
  selector: '[app${this.fileGenerator['toPascalCase'](selector)}]'
})
export class ${className} {
  constructor() {}
}
`;
  }

  private getDirectiveSpecTemplate(className: string, name: string): string {
    return `import {${className}} from './${name}.directive';

describe('${className}', () => {
  it('should create an instance', () => {
    const directive = new ${className}();
    expect(directive).toBeTruthy();
  });
});
`;
  }

  private getPipeTemplate(className: string, pipeName: string): string {
    return `import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: '${pipeName}'
})
export class ${className} implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return value;
  }
}
`;
  }

  private getPipeSpecTemplate(className: string, name: string): string {
    return `import {${className}} from './${name}.pipe';

describe('${className}', () => {
  it('should create an instance', () => {
    const pipe = new ${className}();
    expect(pipe).toBeTruthy();
  });
});
`;
  }

  private getGuardTemplate(className: string): string {
    return `import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ${className} implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
`;
  }

  private getGuardSpecTemplate(className: string, name: string): string {
    return `import {TestBed} from '@angular/core/testing';
import {${className}} from './${name}.guard';

describe('${className}', () => {
  let guard: ${className};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(${className});
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
`;
  }
}
