import {
  AnyObject,
  Count,
  DataObject,
  DefaultCrudRepository,
  Filter,
  FilterExcludingWhere,
  Where,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AbstractConstructorWithGuard,
  EntityWithTenantId,
  ITenantGuard,
} from '../types';

import {inject} from '@loopback/core';
import {AbstractConstructor} from '../../../mixins/types';
import {TenantUtilitiesBindings} from '../keys';
export function TenantGuardMixin<
  M extends EntityWithTenantId,
  ID,
  Relations extends object,
  S extends AbstractConstructor<DefaultCrudRepository<M, ID, Relations>>,
>(
  superClass: S & AbstractConstructor<DefaultCrudRepository<M, ID, Relations>>,
) {
  abstract class GuardedRepo extends superClass {
    @inject(TenantUtilitiesBindings.GuardService)
    public tenantGuardService: ITenantGuard<M, ID>;

    async find(
      filter?: Filter<M>,
      options?: AnyObject,
    ): Promise<(M & Relations)[]> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.find(filter, options);
      }
      const newFilter = await this.tenantGuardService.find(filter);
      return super.find(newFilter, options);
    }

    async findOne(
      filter?: Filter<M>,
      options?: AnyObject,
    ): Promise<(M & Relations) | null> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.findOne(filter, options);
      }
      const newFilter = await this.tenantGuardService.findOne(filter);
      return super.findOne(newFilter, options);
    }

    async findById(
      id: ID,
      filter?: FilterExcludingWhere<M>,
      options?: AnyObject,
    ): Promise<M & Relations> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.findById(id, filter, options);
      }
      const newFilter = await this.tenantGuardService.findById(id, filter);
      const record = await super.findOne(newFilter, options);
      if (record) {
        return record;
      }
      throw new HttpErrors.NotFound();
    }

    async count(where?: Where<M>, options?: AnyObject): Promise<Count> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.count(where, options);
      }
      const newWhere = await this.tenantGuardService.count(where);
      return super.count(newWhere, options);
    }

    async exists(id: ID, options?: AnyObject | undefined): Promise<boolean> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.exists(id, options);
      }
      const where = await this.tenantGuardService.exists(id);
      const result = await super.findOne(
        {
          where,
        },
        options,
      );
      return !!result;
    }

    async create(data: DataObject<M>, options?: AnyObject): Promise<M> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.create(data, options);
      }
      const newData = await this.tenantGuardService.create(data);
      return super.create(newData, options);
    }

    async createAll(data: DataObject<M>[], options?: AnyObject): Promise<M[]> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.createAll(data, options);
      }
      const newData = await this.tenantGuardService.createAll(data);
      return super.createAll(newData, options);
    }

    async save(entity: M, options?: AnyObject): Promise<M> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.save(entity, options);
      }
      const newEntity = await this.tenantGuardService.save(entity);
      return super.save(newEntity, options);
    }

    async update(entity: M, options?: AnyObject): Promise<void> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.update(entity, options);
      }
      const args = await this.tenantGuardService.update(entity);
      const {count} = await super.updateAll(args.data, args.where, options);
      if (count === 0) {
        throw new HttpErrors.NotFound();
      }
    }

    async updateAll(
      data: DataObject<M>,
      where?: Where<M>,
      options?: AnyObject,
    ): Promise<Count> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.updateAll(data, where, options);
      }
      const newArgs = await this.tenantGuardService.updateAll(data, where);
      return super.updateAll(newArgs.data, newArgs.where, options);
    }

    async updateById(
      id: ID,
      data: DataObject<M>,
      options?: AnyObject,
    ): Promise<void> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.updateById(id, data, options);
      }
      const args = await this.tenantGuardService.updateById(id, data);
      const {count} = await super.updateAll(args.data, args.where, options);
      if (count === 0) {
        throw new HttpErrors.NotFound();
      }
    }

    async replaceById(
      id: ID,
      data: DataObject<M>,
      options?: AnyObject,
    ): Promise<void> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.replaceById(id, data, options);
      }
      const args = await this.tenantGuardService.replaceById(id, data);
      const record = await super.findOne(
        {
          where: args.where,
        },
        options,
      );
      if (!record) {
        throw new HttpErrors.NotFound();
      }
      await super.replaceById(id, args.data, options);
    }

    async delete(entity: M, options?: AnyObject): Promise<void> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.delete(entity, options);
      }
      const args = await this.tenantGuardService.delete(entity);
      const {count} = await super.deleteAll(args.where, options);
      if (count === 0) {
        throw new HttpErrors.NotFound();
      }
    }

    async deleteAll(where?: Where<M>, options?: AnyObject): Promise<Count> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.deleteAll(where, options);
      }
      const newWhere = await this.tenantGuardService.deleteAll(where);
      return super.deleteAll(newWhere, options);
    }

    async deleteById(id: ID, options?: AnyObject): Promise<void> {
      if (await this.tenantGuardService.skipTenantGuard()) {
        return super.deleteById(id, options);
      }
      const newWhere = await this.tenantGuardService.deleteById(id);
      const {count} = await super.deleteAll(newWhere, options);
      if (count === 0) {
        throw new HttpErrors.NotFound();
      }
    }
  }
  return GuardedRepo as typeof superClass & AbstractConstructorWithGuard<M, ID>;
}
