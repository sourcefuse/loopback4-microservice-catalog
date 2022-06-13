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
      description: 'create as facade',
      allowNo: true,
    }),
    baseOnService: flags.boolean({
      name: 'baseOnService',
      exclusive: ['facade'],
      description: 'base on sourceloop microservice or not',
      allowNo: true,
    }),
    baseService: flags.enum({
      name: 'service',
      char: 's',
      description: 'base sourceloop microservice',
      options: Object.values(SERVICES),
      required: false,
      exclusive: ['facade'],
      dependsOn: ['baseOnService'],
    }),
    uniquePrefix: flags.string({
      name: 'unique-prefix',
      char: 'p',
      description: 'unique prefix to be used for docker images',
      required: false,
    }),
    datasourceName: flags.string({
      name: 'datasourceName',
      description: 'name of the datasource to generate',
      required: false,
      exclusive: ['facade'],
    }),
    datasourceType: flags.enum({
      name: 'datasourceType',
      description: 'type of the datasource',
      required: false,
      options: Object.values(DATASOURCES),
      exclusive: ['facade'],
    }),
    includeMigrations: flags.boolean({
      name: 'includeMigrations',
      description: 'include base microservice migrations',
      exclusive: ['facade', 'customMigrations'],
      dependsOn: ['baseService', 'datasourceName', 'datasourceType'],
    }),
    customMigrations: flags.boolean({
      name: 'generateMigrations',
      description: 'setup custom migration for this microservice',
      exclusive: ['facade', 'includeMigrations'],
      dependsOn: ['datasourceName', 'datasourceType'],
    }),
  };
  static args = [
    {name: 'name', description: 'name of the microservice', required: false},
  ];

  async run() {
    await super.generate('microservice', Microservice);
  }
}
