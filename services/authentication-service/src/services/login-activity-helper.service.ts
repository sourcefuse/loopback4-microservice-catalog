// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {
  AnyObject,
  Count,
  Filter,
  FilterBuilder,
  FilterExcludingWhere,
  Where,
  WhereBuilder,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  EntityWithTenantId,
  TenantGuardService,
  TenantUtilitiesBindings,
  UserInToken,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {LoginActivity} from '../models/login-activity.model';
import {LoginActivityRepository} from '../repositories';
@injectable({scope: BindingScope.TRANSIENT})
export class LoginActivityHelperService {
  constructor(
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<UserInToken>,
    @inject(TenantUtilitiesBindings.GuardService)
    public tenantGuardService: TenantGuardService<EntityWithTenantId, string>,
    @repository(LoginActivityRepository)
    public loginActivityRepository: LoginActivityRepository,
  ) {}

  async find(filter?: Filter<LoginActivity>, options?: AnyObject) {
    const updatedFilter = filter ?? new FilterBuilder<LoginActivity>().build();
    const user = await this.getCurrentUser();
    if (user.tenantId) {
      updatedFilter.where = this.tenantGuardService.buildWhere(
        user,
        filter?.where,
      );
    }
    return this.loginActivityRepository.find(updatedFilter, options);
  }

  async findById(
    id: string,
    filter?: FilterExcludingWhere<LoginActivity>,
    options?: AnyObject,
  ) {
    let updatedFilter;
    const user = await this.getCurrentUser();
    if (user.tenantId) {
      updatedFilter = {
        ...filter,
        where: this.tenantGuardService.buildWhere(user, undefined, id),
      };
      const record = await this.loginActivityRepository.findOne(
        updatedFilter,
        options,
      );
      if (record) {
        return record;
      }
    }
    throw new HttpErrors.NotFound();
  }

  async findOne(filter?: Filter<LoginActivity>, options?: AnyObject) {
    const updatedFilter = filter ?? new FilterBuilder<LoginActivity>().build();
    const user = await this.getCurrentUser();
    if (user.tenantId) {
      updatedFilter.where = this.tenantGuardService.buildWhere(
        user,
        filter?.where,
      );
    }
    return this.loginActivityRepository.findOne(updatedFilter, options);
  }
  async count(
    where?: Where<LoginActivity>,
    options?: AnyObject,
  ): Promise<Count> {
    let updatedWhere = where ?? new WhereBuilder<LoginActivity>().build();
    const user = await this.getCurrentUser();
    if (user.tenantId) {
      updatedWhere = this.tenantGuardService.buildWhere(user, where);
    }
    return this.loginActivityRepository.count(updatedWhere, options);
  }
}
