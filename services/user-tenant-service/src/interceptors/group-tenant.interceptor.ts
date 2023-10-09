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
import {GroupRepository} from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: GroupTenantInterceptor.BINDING_KEY}})
export class GroupTenantInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = UserTenantServiceKey.GroupTenantInterceptor;

  constructor(
    @repository(GroupRepository) protected groupRepository: GroupRepository,
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
      const groupId = invocationCtx.args[0];
      const groups = await this.groupRepository.find({
        where: {id: groupId},
      });

      if (!groups.length) {
        throw new HttpErrors.Forbidden('Group Access Not Allowed');
      }

      const result = await next();
      return result;
    } catch (err) {
      throw new HttpErrors.Forbidden(err);
    }
  }
}
