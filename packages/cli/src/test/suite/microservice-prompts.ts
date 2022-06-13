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
          message: 'name of the microservice',
          required: true,
        },
        output: 'test',
      },
      {
        input: {
          name: 'facade',
          type: 'confirm',
          message: 'create as facade',
          default: false,
        },
        output: true,
      },
      {
        input: {
          name: 'uniquePrefix',
          type: 'input',
          message: 'unique prefix to be used for docker images',
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
          message: 'name of the microservice',
          required: true,
        },
        output: 'test',
      },
      {
        input: {
          name: 'facade',
          type: 'confirm',
          message: 'create as facade',
          default: false,
        },
        output: false,
      },
      {
        input: {
          name: 'baseOnService',
          message: 'base on sourceloop microservice or not',
          type: 'confirm',
          default: false,
        },
        output: true,
      },
      {
        input: {
          name: 'baseService',
          message: 'base sourceloop microservice',
          type: 'list',
          choices: Object.values(SERVICES),
        },
        output: SERVICES.AUTH,
      },
      {
        input: {
          name: 'uniquePrefix',
          type: 'input',
          message: 'unique prefix to be used for docker images',
        },
        output: 'base',
      },
      {
        input: {
          name: 'datasourceName',
          message: 'name of the datasource to generate',
          type: 'input',
        },
        output: 'pg',
      },
      {
        input: {
          name: 'datasourceType',
          message: 'type of the datasource',
          type: 'list',
          choices: Object.values(DATASOURCES),
        },
        output: DATASOURCES.POSTGRES,
      },
      {
        input: {
          name: 'includeMigrations',
          message: 'include base microservice migrations',
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
          message: 'name of the microservice',
          required: true,
        },
        output: 'test',
      },
      {
        input: {
          name: 'facade',
          type: 'confirm',
          message: 'create as facade',
          default: false,
        },
        output: false,
      },
      {
        input: {
          name: 'baseOnService',
          message: 'base on sourceloop microservice or not',
          type: 'confirm',
          default: false,
        },
        output: true,
      },
      {
        input: {
          name: 'baseService',
          message: 'base sourceloop microservice',
          type: 'list',
          choices: Object.values(SERVICES),
        },
        output: SERVICES.AUTH,
      },
      {
        input: {
          name: 'uniquePrefix',
          type: 'input',
          message: 'unique prefix to be used for docker images',
        },
        output: 'base',
      },
      {
        input: {
          name: 'datasourceName',
          message: 'name of the datasource to generate',
          type: 'input',
        },
        output: 'pg',
      },
      {
        input: {
          name: 'datasourceType',
          message: 'type of the datasource',
          type: 'list',
          choices: Object.values(DATASOURCES),
        },
        output: DATASOURCES.POSTGRES,
      },
      {
        input: {
          name: 'includeMigrations',
          message: 'include base microservice migrations',
          type: 'confirm',
          default: false,
        },
        output: false,
      },
      {
        input: {
          name: 'customMigrations',
          message: 'setup custom migration for this microservice',
          type: 'confirm',
          default: false,
        },
        output: true,
      },
    ],
  },
];
