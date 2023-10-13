// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  inject,
  /* inject, */
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import { HttpErrors } from '@loopback/rest';
import { IAuthUserWithPermissions } from '@sourceloop/core';
import { AuthenticationBindings } from 'loopback4-authentication';
import { UserTenantServiceKey } from '../keys';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({ tags: { key: TenantInterceptorInterceptor.BINDING_KEY } })
export class TenantInterceptorInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY =
    UserTenantServiceKey.TenantInterceptorInterceptor;

  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    protected currentUser: IAuthUserWithPermissions,
  ) { }

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      /**
       * Interceptors are applied to methods in which the tenantId is a parameter within the API endpoint,
       * which is why we can anticipate that tenantId will be the first argument in the invocationCtx.
       */
      const tenantId = invocationCtx.args[0];
      if (tenantId !== this.currentUser.tenantId) {
        throw new HttpErrors.Forbidden(
          'Access to different Tenant Not Allowed',
        );
      }
      const result = await next();
      return result;
    } catch (err) {
      throw new HttpErrors.Forbidden(err);
    }
  }
}
