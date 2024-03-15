import {Getter, inject} from '@loopback/core';
import {
  AnyObject,
  Count,
  Filter,
  FilterBuilder,
  FilterExcludingWhere,
  Where,
  WhereBuilder,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {
  EntityWithTenantId,
  TenantGuardService,
  TenantUtilitiesBindings,
  UserInToken,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {LoginActivity} from '../../models';
import {AuthDbSourceName} from '../../types';

export class LoginActivityRepository extends SequelizeCrudRepository<
  LoginActivity,
  typeof LoginActivity.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<UserInToken>,
    @inject(TenantUtilitiesBindings.GuardService)
    public tenantGuardService: TenantGuardService<EntityWithTenantId, string>,
  ) {
    super(LoginActivity, dataSource);
  }
  async find(filter?: Filter<LoginActivity>, options?: AnyObject) {
    const updatedFilter = filter ?? new FilterBuilder<LoginActivity>().build();
    const user = await this.getCurrentUser();
    if (user.tenantId) {
      updatedFilter.where = this.tenantGuardService.buildWhere(
        user,
        filter?.where,
      );
    }
    return super.find(updatedFilter, options);
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
      const record = await super.findOne(updatedFilter, options);
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
    return super.findOne(updatedFilter, options);
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
    return super.count(updatedWhere, options);
  }
}
