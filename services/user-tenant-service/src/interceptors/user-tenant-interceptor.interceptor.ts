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
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantServiceKey} from '../keys';
import {UserTenantRepository} from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: UserTenantInterceptorInterceptor.BINDING_KEY}})
export class UserTenantInterceptorInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY =
    UserTenantServiceKey.UserTenantInterceptorInterceptor;

  constructor(
    @repository(UserTenantRepository)
    protected userTenantRepository: UserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected currentUser: IAuthUserWithPermissions,
  ) {}

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
       * Interceptors are applied to methods in which the userTenantId is a parameter within the API endpoint,
       * which is why we can anticipate that userTenantId will be the first argument in the invocationCtx.
       */
      const userTenantId = invocationCtx.args[0];
      const userTenant = await this.userTenantRepository.findById(userTenantId);
      if (userTenant.tenantId !== this.currentUser.tenantId) {
        throw new HttpErrors.Forbidden('user tenant is from another tenant');
      }
      const result = await next();
      return result;
    } catch (err) {
      throw new HttpErrors.Forbidden(err);
    }
  }
}
