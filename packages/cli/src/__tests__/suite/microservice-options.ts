import {DATASOURCES, SERVICES} from '../../enum';

export const microserviceOptionsSuite = [
  {
    name: 'microservice command to create a facade',
    options: {
      name: 'test',
      facade: true,
      uniquePrefix: 'base',
    },
    prompts: [],
    argv: ['test', '--facade', '--uniquePrefix', 'base'],
  },
  {
    name: 'microservice command to create a microservice including migrations',
    options: {
      name: 'test',
      facade: false,
      uniquePrefix: 'base',
      baseOnService: true,
      baseService: SERVICES.AUTH,
      datasourceName: 'pg',
      datasourceType: DATASOURCES.POSTGRES,
      sequelize: true,
      includeMigrations: true,
    },
    prompts: [],
    argv: [
      'test',
      '--no-facade',
      '--uniquePrefix',
      'base',
      '--baseOnService',
      '--baseService',
      SERVICES.AUTH,
      '--datasourceName',
      'pg',
      '--datasourceType',
      DATASOURCES.POSTGRES,
      '--sequelize',
      '--includeMigrations',
    ],
  },
  {
    name: 'microservice command to create a microservice with custom migrations',
    options: {
      name: 'test',
      facade: false,
      uniquePrefix: 'base',
      baseOnService: true,
      baseService: SERVICES.AUTH,
      datasourceName: 'pg',
      datasourceType: DATASOURCES.POSTGRES,
      sequelize: true,
      customMigrations: true,
    },
    prompts: [],
    argv: [
      'test',
      '--no-facade',
      '--uniquePrefix',
      'base',
      '--baseOnService',
      '--baseService',
      SERVICES.AUTH,
      '--datasourceName',
      'pg',
      '--datasourceType',
      DATASOURCES.POSTGRES,
      '--sequelize',
      '--customMigrations',
    ],
  },
];
