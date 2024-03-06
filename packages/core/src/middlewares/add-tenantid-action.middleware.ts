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
  HttpErrors,
  Middleware,
  MiddlewareContext,
  Request,
  RequestContext,
  RestBindings,
} from '@loopback/rest';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as CryptoJS from 'crypto-js';
import {AuthErrorKeys, AuthenticationBindings} from 'loopback4-authentication';
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
    if (request && response && this.currentUser?.tenantId) {
      if (!process.env.TENANT_SECRET_KEY) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      const secretKey = process.env.TENANT_SECRET_KEY as string;
      const tenantId = this.currentUser.tenantId;
      const encryptedTenantId = CryptoJS.AES.encrypt(
        tenantId,
        secretKey,
      ).toString();
      request.headers['tenant-id'] = encryptedTenantId;
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
