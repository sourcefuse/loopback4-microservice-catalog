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
import { UserTenantRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { UserTenantServiceKey } from '../keys';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: UserTenantInterceptorInterceptor.BINDING_KEY}})
export class UserTenantInterceptorInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = UserTenantServiceKey.UserTenantInterceptorInterceptor;

  constructor(
    @repository(UserTenantRepository) protected userTenantRepository: UserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER) protected currentUser:IAuthUserWithPermissions,
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
      // Add pre-invocation logic here
      const userTenantId=invocationCtx.args[0];
      const userTenant=await this.userTenantRepository.findById(userTenantId);
      if(userTenant.tenantId!==this.currentUser.tenantId){
        throw new HttpErrors.Forbidden('user tenant is from another tenant')
      }
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
