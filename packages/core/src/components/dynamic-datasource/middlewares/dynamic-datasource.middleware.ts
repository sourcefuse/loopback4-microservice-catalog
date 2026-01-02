import {Provider, inject, injectable} from '@loopback/core';
import {Middleware, RequestContext, asMiddleware} from '@loopback/rest';

import {
  DynamicDatasourceBindings,
  SetupDatasourceFn,
} from 'loopback4-dynamic-datasource';
import {MIddlewareGroup, MiddlewareChain} from '../../../enums';

@injectable(
  asMiddleware({
    chain: MiddlewareChain.PRE_INVOKE,
    group: MIddlewareGroup.DYNAMIC_DATASOURCE,
  }),
)
export class DynamicDatasourceMiddlewareProvider implements Provider<Middleware> {
  constructor(
    @inject(DynamicDatasourceBindings.DYNAMIC_DATASOURCE_ACTION)
    private readonly setupDatasource: SetupDatasourceFn,
  ) {}
  value(): Middleware {
    return async (ctx, next) => {
      await this.setupDatasource(ctx as RequestContext);
      return next();
    };
  }
}
