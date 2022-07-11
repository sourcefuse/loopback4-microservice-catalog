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
      type: 'boolean',
    }),
    facade: flags.boolean({
      name: 'facade',
      description: 'create a microservice facade',
      type: 'boolean',
      allowNo: true,
    }),
    baseService: flags.enum({
      name: 'service',
      char: 's',
      description: 'base sourceloop microservice',
      options: Object.values(SERVICES),
      required: false,
    }),
    uniquePrefix: flags.string({
      name: 'unique-prefix',
      char: 'p',
      description: 'unique prefix to be used for docker images',
      required: false,
    }),
    datasourceName: flags.string({
      name: 'datasource-name',
      description: 'name of the datasource to generate',
      required: false,
    }),
    datasourceType: flags.enum({
      name: 'datasource-type',
      description: 'type of the datasource',
      required: false,
      options: Object.values(DATASOURCES),
    }),
    includeMigrations: flags.boolean({
      name: 'include-migrations',
      description: 'include base microservice migrations',
    }),
    customMigrations: flags.boolean({
      name: 'generate-migrations',
      description: 'setup custom migration for this microservice',
    }),
  };
  static args = [
    {name: 'name', description: 'name of the microservice', required: false},
  ];

  async run() {
    const inputs = this.parse(Microservice);
    await super.generate('microservice', {
      name: inputs.args.name,
      ...inputs.flags,
    });
  }
}
