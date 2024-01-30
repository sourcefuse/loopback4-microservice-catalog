import {Provider} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as AWS from 'aws-sdk';
import {DatasourceProviderFn} from 'loopback4-dynamic-datasource';
let test: DatasourceProviderFn;
export class CustomDatasourceProvider
  implements Provider<DatasourceProviderFn>
{
  constructor() {}
  async value(): Promise<DatasourceProviderFn> {
    return async datasourceIdentifier => {
      const ssm = new AWS.SSM({
        accessKeyId: process.env.AWS_ACCESS_ID,
        region: process.env.AWS_REGION,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      //Write logic here to fetch SSM Key Parameter Name Dynamically using datasourceIdentifier
      const ssmKeyParamName = 'DS_DETAIL_FIRST';
      let dataSourceConfig = {};
      return {
        pgdb: async () => {
          const data = await this.getParameterValueFromSSM(ssmKeyParamName);
          if (data?.Parameter) {
            const parameterStr = data.Parameter.Value
              ? data.Parameter.Value.replace(/\n/gm, '')
              : '';
            dataSourceConfig = JSON.parse(parameterStr);
            return new juggler.DataSource({
              name: 'pgdb',
              ...dataSourceConfig,
            });
          }
          return new juggler.DataSource({
            name: 'pgdb',
            ...dataSourceConfig,
          });
        },
      };
    };
  }

  async getParameterValueFromSSM(ssmKeyParamName: string) {
    const ssm = new AWS.SSM({
      accessKeyId: process.env.AWS_ACCESS_ID,
      region: process.env.AWS_REGION,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
    return await ssm
      .getParameter({
        Name: ssmKeyParamName,
        WithDecryption: true,
      })
      .promise();
  }
}
