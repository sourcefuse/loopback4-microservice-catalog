// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Context,
  Getter,
  InvocationResult,
  Provider,
  ValueOrPromise,
  globalInterceptor,
  inject,
} from '@loopback/core';
import {
  Middleware,
  MiddlewareContext,
  Request,
  RequestContext,
  RestBindings,
} from '@loopback/rest';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '../components/bearer-verifier';
@globalInterceptor()
export class AddTenantActionMiddlewareInterceptor
  implements Provider<Middleware>
{
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    protected currentUser: IAuthUserWithPermissions,
    @inject.getter(RestBindings.Http.REQUEST)
    private readonly getRequest: Getter<Request>,
  ) {}
  value() {
    return this.intercept.bind(this);
  }

  async intercept(
    context: MiddlewareContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    let request, response;
    if (this.isRequestContext(context.parent)) {
      request = context.parent.request;
      response = context.parent.response;
    }
    if (request && response) {
      request.headers['tenant-id'] = this.currentUser.tenantId;
    }

    return next();
  }
  private isRequestContext(context?: Context): context is RequestContext {
    return !!(
      (context as RequestContext).request &&
      (context as RequestContext).response
    );
  }
}
