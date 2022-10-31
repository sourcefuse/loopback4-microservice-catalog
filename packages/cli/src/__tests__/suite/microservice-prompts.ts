import {DATASOURCES, SERVICES} from '../../enum';

export const microservicePromptsSuite = [
  {
    name: 'microservice command to create a facade',
    options: {
      name: 'test',
      facade: true,
      uniquePrefix: 'base',
    },
    prompts: [
      {
        input: {
          type: 'string',
          name: 'name',
          message: 'Name of the microservice',
          required: true,
        },
        output: 'test',
      },
      {
        input: {
          name: 'facade',
          type: 'confirm',
          message: 'Create as facade',
          default: false,
        },
        output: true,
      },
      {
        input: {
          name: 'uniquePrefix',
          type: 'input',
          message: 'Unique prefix to be used for docker images',
        },
        output: 'base',
      },
    ],
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
      includeMigrations: true,
    },
    prompts: [
      {
        input: {
          type: 'string',
          name: 'name',
          message: 'Name of the microservice',
          required: true,
        },
        output: 'test',
      },
      {
        input: {
          name: 'facade',
          type: 'confirm',
          message: 'Create as facade',
          default: false,
        },
        output: false,
      },
      {
        input: {
          name: 'baseOnService',
          message: 'Base on sourceloop microservice or not',
          type: 'confirm',
          default: false,
        },
        output: true,
      },
      {
        input: {
          name: 'baseService',
          message: 'Base sourceloop microservice',
          type: 'list',
          choices: Object.values(SERVICES),
        },
        output: SERVICES.AUTH,
      },
      {
        input: {
          name: 'uniquePrefix',
          type: 'input',
          message: 'Unique prefix to be used for docker images',
        },
        output: 'base',
      },
      {
        input: {
          name: 'datasourceName',
          message: 'Name of the datasource to generate',
          type: 'input',
        },
        output: 'pg',
      },
      {
        input: {
          name: 'datasourceType',
          message: 'Type of the datasource',
          type: 'list',
          choices: Object.values(DATASOURCES),
        },
        output: DATASOURCES.POSTGRES,
      },
      {
        input: {
          name: 'includeMigrations',
          message: 'Include base microservice migrations',
          type: 'confirm',
          default: false,
        },
        output: true,
      },
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
      includeMigrations: false,
      customMigrations: true,
    },
    prompts: [
      {
        input: {
          type: 'string',
          name: 'name',
          message: 'Name of the microservice',
          required: true,
        },
        output: 'test',
      },
      {
        input: {
          name: 'facade',
          type: 'confirm',
          message: 'Create as facade',
          default: false,
        },
        output: false,
      },
      {
        input: {
          name: 'baseOnService',
          message: 'Base on sourceloop microservice or not',
          type: 'confirm',
          default: false,
        },
        output: true,
      },
      {
        input: {
          name: 'baseService',
          message: 'Base sourceloop microservice',
          type: 'list',
          choices: Object.values(SERVICES),
        },
        output: SERVICES.AUTH,
      },
      {
        input: {
          name: 'uniquePrefix',
          type: 'input',
          message: 'Unique prefix to be used for docker images',
        },
        output: 'base',
      },
      {
        input: {
          name: 'datasourceName',
          message: 'Name of the datasource to generate',
          type: 'input',
        },
        output: 'pg',
      },
      {
        input: {
          name: 'datasourceType',
          message: 'Type of the datasource',
          type: 'list',
          choices: Object.values(DATASOURCES),
        },
        output: DATASOURCES.POSTGRES,
      },
      {
        input: {
          name: 'includeMigrations',
          message: 'Include base microservice migrations',
          type: 'confirm',
          default: false,
        },
        output: false,
      },
      {
        input: {
          name: 'customMigrations',
          message: 'Setup custom migration for this microservice',
          type: 'confirm',
          default: false,
        },
        output: true,
      },
    ],
  },
];
