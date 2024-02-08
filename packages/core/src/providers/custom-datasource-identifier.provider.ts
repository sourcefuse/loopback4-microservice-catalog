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
      const tokenWithBearerString = requestCtx.request.headers?.authorization;
      if (requestCtx.request.headers && tokenWithBearerString) {
        return this.getTenantIdHelper.getTenantIdFromToken(
          tokenWithBearerString,
        );
      }
      return null;
    };
  }
}
