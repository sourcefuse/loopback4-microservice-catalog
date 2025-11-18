// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import Base from '../../command-base';
import {AnyObject} from '../../types';

export class AngularGenerate extends Base<{}> {
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
    await this.generate('angular', AngularGenerate);
  }

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(inputs, 'angular', []);
  }
}
