import {Provider, service} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DatasourceProviderFn} from 'loopback4-dynamic-datasource';
import {AwsSsmHelperService} from '../services';
export class CustomDatasourceProvider
  implements Provider<DatasourceProviderFn>
{
  constructor(
    @service(AwsSsmHelperService)
    public awsSsmHelper: AwsSsmHelperService,
  ) {}
  async value(): Promise<DatasourceProviderFn> {
    return async datasourceIdentifier => {
      const tenantId = datasourceIdentifier.id;
      //Write logic here to fetch SSM Key Parameter Name Dynamically using datasourceIdentifier
      const ssmKeyParamName = process.env.SSM_PREFIX
        ? `${process.env.SSM_PREFIX}/${tenantId}`
        : `${tenantId}`;
      let dataSourceConfig = {};
      return {
        pgdb: async () => {
          const data =
            await this.awsSsmHelper.getSSMParameterValue(ssmKeyParamName);
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
}
