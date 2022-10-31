// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {flags} from '@oclif/command';
import Base from '../command-base';
import {DATASOURCES, SERVICES} from '../enum';
import {MicroserviceOptions} from '../types';

export class Microservice extends Base<MicroserviceOptions> {
  static description = 'add a microservice';

  static flags = {
    help: flags.boolean({
      name: 'help',
      description: 'show manual pages',
    }),
    facade: flags.boolean({
      name: 'facade',
      description: 'Create as facade',
      allowNo: true,
    }),
    baseOnService: flags.boolean({
      name: 'baseOnService',
      exclusive: ['facade'],
      description: 'Base on sourceloop microservice or not',
      allowNo: true,
    }),
    baseService: flags.enum({
      name: 'service',
      char: 's',
      description: 'Base sourceloop microservice',
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
  static args = [
    {name: 'name', description: 'Name of the microservice', required: false},
  ];

  async run() {
    await super.generate('microservice', Microservice);
  }
}
