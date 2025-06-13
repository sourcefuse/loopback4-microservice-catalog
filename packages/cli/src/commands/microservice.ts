// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
// eslint-disable-next-line @typescript-eslint/naming-convention
import Base from '../command-base';
import {DATASOURCES, SERVICES} from '../enum';
import {AnyObject, MicroserviceOptions} from '../types';
import {buildOptions} from '../utils';

export class Microservice extends Base<MicroserviceOptions> {
  static readonly description =
    'Add a microservice in the services or facade folder of a ARC generated monorepo. This can also optionally add migrations for the same microservice.';
  static readonly mcpDescription = `
    Use this command to generate or add a microservice in the ARC based monorepo following the ARC standards and best practices.
    The generated microservice can be used as a standalone service or as a facade in the monorepo.
    It can also generate migrations for the same microservice.
    The microservice will be created in the services or facades folder of the monorepo depending on the options passed.
    It can also generate datasource and import migrations from the ARC services code. It can not update existing services or facades, 
    for example, you can not run it again just with migration option as it would fail, saying the service already exists.
    Refer existing service if any for discovering the parameters not provided by the user, or ask the user directly`;
  static readonly mcpFlags = {
    workingDir: flags.string({
      name: 'workingDir',
      description: 'Path of the root directory of the monorepo',
      required: false,
    }),
  };
  static readonly flags = {
    help: flags.boolean({
      name: 'help',
      description: 'show manual pages',
    }),
    facade: flags.boolean({
      name: 'facade',
      description: 'Create as facade inside the facades folder',
      allowNo: true,
    }),
    baseOnService: flags.boolean({
      name: 'baseOnService',
      exclusive: ['facade'],
      description: 'Base on ARC microservice or not',
      allowNo: true,
    }),
    baseService: flags.enum({
      name: 'service',
      char: 's',
      description: 'Base ARC microservice',
      options: Object.values(SERVICES),
      required: false,
      exclusive: ['facade'],
      dependsOn: ['baseOnService'],
    }),
    uniquePrefix: flags.string({
      name: 'unique-prefix',
      char: 'p',
      description: 'Unique prefix to be used for docker images',
      required: false,
    }),
    datasourceName: flags.string({
      name: 'datasourceName',
      description: 'Name of the datasource to generate',
      required: false,
      exclusive: ['facade'],
    }),
    datasourceType: flags.enum({
      name: 'datasourceType',
      description: 'Type of the datasource',
      required: false,
      options: Object.values(DATASOURCES),
      exclusive: ['facade'],
    }),
    sequelize: flags.boolean({
      name: 'sequelize',
      description: 'Include sequelize as ORM in service',
      required: false,
      exclusive: ['facade'],
    }),
    includeMigrations: flags.boolean({
      name: 'includeMigrations',
      description: 'Include base microservice migrations',
      exclusive: ['facade', 'customMigrations'],
      dependsOn: ['baseService'],
    }),
    customMigrations: flags.boolean({
      name: 'generateMigrations',
      description: 'Setup custom migration for this microservice',
      exclusive: ['facade', 'includeMigrations'],
    }),
  };
  static readonly args = [
    {name: 'name', description: 'Name of the microservice', required: false},
  ];

  async run() {
    await super.generate('microservice', Microservice);
  }

  static async mcpRun(inputs: AnyObject) {
    return Base.mcpResponse(
      {
        ...inputs,
        config: JSON.stringify({
          ...buildOptions,
          applicationName: inputs.name,
          description: `ARC based ${inputs.name}`,
        }),
        inMcp: true,
      },
      'microservice',
      [inputs.name, '-y'],
    );
  }
}
