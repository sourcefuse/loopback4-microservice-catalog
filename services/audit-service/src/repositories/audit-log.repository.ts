// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor, inject} from '@loopback/core';
import {
  AnyObject,
  DefaultCrudRepository,
  Entity,
  Filter,
  FilterExcludingWhere,
  Options,
  juggler,
} from '@loopback/repository';
import {AuditDbSourceName} from '@sourceloop/audit-log';

import {AuditLog} from '../models';
import {MixinBaseClass} from 'loopback4-soft-delete';

export interface OverriddenMethods<
  E extends Entity,
  ID,
  R extends object = {},
> {
  find(filter?: Filter<E>, options?: Options): Promise<(E & R)[]>;
  findById(
    id: ID,
    filter?: FilterExcludingWhere<E>,
    options?: Options,
  ): Promise<E & R>;
}

export function AuditLogExtraLogicMixin<
  E extends Entity,
  ID,
  T extends MixinBaseClass<OverriddenMethods<E, ID, R>>,
  R extends object = {},
>(base: T & MixinBaseClass<OverriddenMethods<E, ID, R>>) {
  class AuditLogRepositoryExtended extends base {
    find(filter?: Filter<E>, options?: AnyObject): Promise<(E & R)[]> {
      console.log('⏳🚀 common extra logic on find, woo!', base);
      return super.find(filter, options);
    }
  }
  return AuditLogRepositoryExtended;
}

export class AuditLogRepository extends AuditLogExtraLogicMixin<
  AuditLog,
  typeof AuditLog.prototype.id,
  Constructor<DefaultCrudRepository<AuditLog, typeof AuditLog.prototype.id>>
>(DefaultCrudRepository) {
  constructor(
    @inject(`datasources.${AuditDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(AuditLog, dataSource);
  }
}
