// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Context,
  InvocationResult,
  Provider,
  ValueOrPromise,
  globalInterceptor,
  inject,
} from '@loopback/core';
import {Middleware, MiddlewareContext, RequestContext} from '@loopback/rest';

import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from '../components/bearer-verifier';
import {SFCoreBindings} from '../keys';
import {CoreConfig, TenantIdEncryptionFn} from '../types';
@globalInterceptor()
export class TenantContextMiddlewareInterceptorProvider implements Provider<Middleware> {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    protected currentUser: IAuthUserWithPermissions,
    @inject(SFCoreBindings.config, {optional: true})
    private readonly coreConfig: CoreConfig,
    @inject(SFCoreBindings.TENANTID_ENCRYPTION_PROVIDER)
    private readonly tenantIdEncryptionProvider: TenantIdEncryptionFn,
  ) {}
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The intercept function checks for a request context, encrypts the tenant ID, and adds it to the
   * request headers if the current user has a tenant ID and a secret key is available.
   */
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
      if (!this.coreConfig.tenantContextEncryptionKey) {
        request.headers['tenant-id'] = this.currentUser.tenantId;
      } else {
        const encryptedTenantId = await this.tenantIdEncryptionProvider(
          this.coreConfig.tenantContextEncryptionKey,
          this.currentUser.tenantId,
        );
        request.headers['tenant-id'] = encryptedTenantId;
      }
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
