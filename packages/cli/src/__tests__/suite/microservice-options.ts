import { DATASOURCES, SERVICES } from '../../enum';

export const microserviceOptionsSuite = [
  {
    name: 'microservice command to create a facade',
    options: {
      name: 'test',
      cdk: false,
      facade: true,
      uniquePrefix: 'base',
    },
    prompts: [
      {
        input: {
          type: 'confirm',
          name: 'cdk',
          message: 'include arc-cdk?',
          default: false,
        },
        output: false,
      },
    ],
    argv: ['test', '--facade', '--uniquePrefix', 'base'],
  },
  {
    name: 'microservice command to create a microservice including migrations',
    options: {
      name: 'test',
      cdk: false,
      facade: false,
      uniquePrefix: 'base',
      baseOnService: true,
      baseService: SERVICES.AUTH,
      datasourceName: 'pg',
      datasourceType: DATASOURCES.POSTGRES,
      includeMigrations: true,
    },
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
      '--includeMigrations',
    ],
    prompts: [
      {
        input: {
          type: 'confirm',
          name: 'cdk',
          message: 'include arc-cdk?',
          default: false,
        },
        output: false,
      },
    ],
  },
  {
    name: 'microservice command to create a microservice with custom migrations',
    options: {
      name: 'test',
      cdk: false,
      facade: false,
      uniquePrefix: 'base',
      baseOnService: true,
      baseService: SERVICES.AUTH,
      datasourceName: 'pg',
      datasourceType: DATASOURCES.POSTGRES,
      customMigrations: true,
    },
    prompts: [
      {
        input: {
          type: 'confirm',
          name: 'cdk',
          message: 'include arc-cdk?',
          default: false,
        },
        output: false,
      },
    ],
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
      '--customMigrations',
    ],
  },
];
