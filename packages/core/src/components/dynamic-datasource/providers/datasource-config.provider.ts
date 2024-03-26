import {Provider, ValueOrPromise} from '@loopback/context';
import {service} from '@loopback/core';
import {AwsSsmHelperService} from '../services';
import {DataSourceConfigProviderFn} from '../types';

/**
 * A default implementation using SSM as the config provider is used
 * Can be overriden by implementing a provider for DataSourceConfigProviderFn
 * and binding it to DynamicDataSourceBinding.DATA_SOURCE_CONFIG_PROVIDER key
 */
export class DataSourceConfigProvider
  implements Provider<DataSourceConfigProviderFn>
{
  constructor(
    @service(AwsSsmHelperService)
    public awsSsmHelper: AwsSsmHelperService,
  ) {}
  value(): ValueOrPromise<DataSourceConfigProviderFn> {
    return async (tenantId: string) => {
      const ssmKeyParamName = process.env.SSM_PREFIX
        ? `${process.env.SSM_PREFIX}/${tenantId}`
        : `${tenantId}`;

      const data =
        await this.awsSsmHelper.getSSMParameterValue(ssmKeyParamName);
      if (data?.Parameter) {
        const parameterStr = data.Parameter.Value
          ? data.Parameter.Value.replace(/\n/gm, '')
          : '';
        return [JSON.parse(parameterStr)];
      }
      return [];
    };
  }
}
