// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {Project} from 'ts-morph';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Base from '../command-base';
import {IacList} from '../enum';
import {AnyObject, CdkOptions} from '../types';

const DEFAULT_APP_PATH = 'src/application.ts';
export class Cdk extends Base<CdkOptions> {
  static readonly description = 'add arc-cdk';
  static readonly mcpDescription = `
    Use this command to add arc-cdk to your project.
    The arc-cdk is a library that provides a set of tools and utilities to help you build and deploy your applications on AWS using the AWS Cloud Development Kit (CDK).
    It provides a set of constructs that can be used to build and deploy your applications on AWS using the AWS CDK.
    Refer existing service if any for discovering the parameters not provided by the user, or ask the user directly
    `;
  static readonly flags = {
    help: flags.boolean({
      name: 'help',
      description: 'show manual pages',
    }),
    iac: flags.enum({
      name: 'iac',
      char: 'i',
      description: 'iac for the service',
      required: false,
      options: Object.values(IacList),
    }),
    dir: flags.string({
      name: 'dir',
      char: 'd',
      description: 'Name of the dir to store arc-cdk files',
      required: false,
    }),
    packageJsonName: flags.string({
      name: 'packageJsonName',
      char: 'p',
      description: 'Package name for arc-cdk',
      required: false,
    }),
    applicationClassName: flags.string({
      name: 'applicationClassName',
      char: 'a',
      description: 'Class name of the service you want to deploy',
      required: false,
      default: this.getDefaultAppClassName(),
    }),
    relativePathToApp: flags.string({
      name: 'relativePathToApp',
      char: 'r',
      description: 'Relative path to the application ts file',
      required: false,
      default: this.getDefaultAppPath(),
    }),
    overwriteDockerfile: flags.boolean({
      name: 'overwriteDockerfile',
      char: 'o',
      description:
        'Overwrite the existing Dockerfile for Lambda deployment (if it exists)?',
      required: false,
    }),
  };

  static readonly mcpFlags = {
    workingDir: flags.string({
      name: 'workingDir',
      description:
        'path of the microservice or facade folder you want to add cdk to, note that this not the root directory of the monorepo',
      required: true,
    }),
  };

  static getDefaultAppClassName() {
    let appClassName: string | undefined = undefined;
    const currentDir = process.cwd();
    const appPath = join(currentDir, DEFAULT_APP_PATH);
    const project = new Project();
    const sourcefile = project.addSourceFileAtPathIfExists(appPath);
    if (sourcefile) {
      const classes = sourcefile.getClasses();
      if (classes.length === 1) {
        appClassName = classes[0].getName();
      }
    }
    return appClassName;
  }

  static getDefaultAppPath() {
    let path: string | undefined = undefined;
    if (existsSync(DEFAULT_APP_PATH)) {
      path = DEFAULT_APP_PATH;
    }
    return path;
  }

  async run() {
    await super.generate('cdk', Cdk);
  }

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(inputs, 'cdk', []);
  }
}
