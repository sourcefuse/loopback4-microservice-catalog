import {Provider, service} from '@loopback/core';
import {DatasourceIdentifierFn} from 'loopback4-dynamic-datasource';
import {TenantIdentifierHelperService} from '../services';

export class CustomDatasourceIdentifierProvider
  implements Provider<DatasourceIdentifierFn>
{
  constructor(
    @service(TenantIdentifierHelperService)
    public getTenantIdHelper: TenantIdentifierHelperService,
  ) {}
  value(): DatasourceIdentifierFn {
    return async requestCtx => {
      const tokenWithBearerString = String(
        requestCtx.request.headers?.authorization,
      );
      if (tokenWithBearerString) {
        return this.getTenantIdHelper.getTenantIdFromToken(
          tokenWithBearerString,
        );
      }
      return null;
    };
  }
}
