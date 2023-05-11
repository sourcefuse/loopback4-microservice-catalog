import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {
  AnyObject,
  DataObject,
  Filter,
  FilterExcludingWhere,
  Where,
  WhereBuilder,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthenticationBindings} from 'loopback4-authentication';

import {TenantType} from '../enums';
import {TenantUtilitiesErrorKeys} from '../error-keys';
import {EntityWithTenantId, ITenantGuard, UserInToken} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class TenantGuardService<T extends EntityWithTenantId, ID>
  implements ITenantGuard<T, ID>
{
  constructor(
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<UserInToken>,
  ) {}

  async skipTenantGuard(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user.tenantType === TenantType.MASTER;
  }

  find(filter?: Filter<T>): Promise<Filter<T>> {
    return this.addTenantToFilter(filter);
  }

  async findOne(filter?: Filter<T>): Promise<Filter<T>> {
    return this.addTenantToFilter(filter);
  }

  async findById(id: ID, filter?: FilterExcludingWhere<T>): Promise<Filter<T>> {
    return this.addTenantToFilter(filter, id);
  }

  async count(where?: Where<T>): Promise<Where<T>> {
    return this.addTenantToWhere(where);
  }

  async exists(id: ID): Promise<Where<T>> {
    return this.addTenantToWhere(undefined, id);
  }

  create(data: DataObject<T>): Promise<DataObject<T>> {
    return this.addTenantId(data);
  }

  createAll<R extends DataObject<T> | T>(data: R[]): Promise<R[]> {
    return this.addTenantIDMultiple(data);
  }

  save(entity: T): Promise<T> {
    return this.addTenantId(entity);
  }

  async replaceById(
    id: ID,
    data: DataObject<T>,
  ): Promise<{data: DataObject<T>; where: Where<T>}> {
    return this.updateById(id, data);
  }

  async updateById<R extends DataObject<T> | T>(
    id: ID,
    data: R,
  ): Promise<{data: R; where: Where<T>}> {
    await this.checkTenantId(data);
    return this.addTenantToWhere(undefined, id).then(where => ({
      where,
      data,
    }));
  }

  async update(data: T): Promise<{data: T; where: Where<T>}> {
    await this.checkTenantId(data);
    return this.addTenantToWhere(undefined, data.getId()).then(newWhere => ({
      where: newWhere,
      data,
    }));
  }

  async updateAll(
    data: DataObject<T>,
    where?: Where<T>,
  ): Promise<{data: DataObject<T>; where: Where<T>}> {
    await this.checkTenantId(data);
    return this.addTenantToWhere(where).then(newWhere => ({
      where: newWhere,
      data,
    }));
  }

  deleteById(id: ID): Promise<Where<T>> {
    return this.addTenantToWhere(undefined, id);
  }

  async delete(entity: T): Promise<{where: Where<T>; entity: T}> {
    await this.checkTenantId(entity);
    return this.addTenantToWhere(undefined, entity.getId()).then(where => ({
      where,
      entity,
    }));
  }

  async deleteAll(where?: Where<T>): Promise<Where<T>> {
    return this.addTenantToWhere(where);
  }

  private async checkTenantId(data: T | DataObject<T>): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user.tenantId) {
      throw new HttpErrors.Unauthorized(
        TenantUtilitiesErrorKeys.TenantIdMissing,
      );
    }
    if (data.tenantId && data.tenantId !== user.tenantId) {
      throw new HttpErrors.Forbidden(
        TenantUtilitiesErrorKeys.TenantIdDoesNotMatch,
      );
    }
  }

  private async addTenantId<S extends DataObject<T> | T>(
    entity: S,
  ): Promise<S> {
    const user = await this.getCurrentUser();
    await this.checkTenantId(entity);
    entity.tenantId = user.tenantId;
    return entity;
  }

  private async addTenantIDMultiple<R extends DataObject<T> | T>(
    entities: R[],
  ): Promise<R[]> {
    const user = await this.getCurrentUser();
    const tenantId = user.tenantId;
    if (tenantId) {
      entities.forEach(entity => {
        if (!entity.tenantId) {
          entity.tenantId = tenantId;
        } else if (entity.tenantId !== tenantId) {
          throw new HttpErrors.Forbidden(
            `${TenantUtilitiesErrorKeys.TenantIdDoesNotMatch}: ${entity.tenantId}`,
          );
        } else {
          // do nothing
        }
      });
      return entities;
    }
    throw new HttpErrors.Unauthorized(TenantUtilitiesErrorKeys.TenantIdMissing);
  }

  private async addTenantToWhere(where?: Where<T>, id?: ID): Promise<Where<T>> {
    const user = await this.getCurrentUser();
    if (user.tenantId) {
      return this.buildWhere(user, where, id);
    }
    throw new HttpErrors.Unauthorized(TenantUtilitiesErrorKeys.TenantIdMissing);
  }
  private async addTenantToFilter(
    filter?: Filter<T>,
    id?: ID,
  ): Promise<Filter<T>> {
    const user = await this.getCurrentUser();
    if (user.tenantId) {
      return {
        ...filter,
        where: this.buildWhere(user, filter?.where, id),
      };
    }
    throw new HttpErrors.Unauthorized(TenantUtilitiesErrorKeys.TenantIdMissing);
  }

  private buildWhere(user: UserInToken, where?: Where<T>, id?: ID): Where<T> {
    const whereBuilder = new WhereBuilder<AnyObject>();
    const extraFilter: AnyObject = {
      tenantId: user.tenantId,
    };
    if (id) {
      extraFilter.id = id;
    }
    if (!where) {
      return extraFilter as Where<T>;
    }
    whereBuilder.and([where, extraFilter].filter(w => !!w));
    return whereBuilder.build();
  }
}
