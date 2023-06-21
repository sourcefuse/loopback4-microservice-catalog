// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  Count,
  DataObject,
  DefaultCrudRepository,
  juggler,
  Options,
  Where,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {AuthorizeErrorKeys} from 'loopback4-authorization';
import {VideoConfDatasource} from '../keys';
import {AuditLogs} from '../models';

/**
 * Audit Logs Repository
 *
 * This repository is usable for those who are using the audit trigger from the default migrations provided by this service.
 * This is deprecated and will be removed in future releases. Users are advised to utilize the `AuditLogRepository` in case needed (more instructions provided in the Audit Logs section inside README.md).
 * @deprecated Use the {@link AuditLogRepository} instead.
 * eg.
 * ```ts
 * class MyRepository{
 *  constructor(
 *  @repository.getter('AuditLogRepository')
 *   public getAuditLogRepository: Getter<AuditLogRepository>
 *  ){
 *     // ...
 *  }
 *  // ...
 * }
 * ```
 */
export class AuditLogsRepository extends DefaultCrudRepository<
  AuditLogs,
  typeof AuditLogs.prototype.id
> {
  constructor(
    @inject(`datasources.${VideoConfDatasource}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(AuditLogs, dataSource);
  }

  async create(
    entity: DataObject<AuditLogs>,
    options?: Options,
  ): Promise<AuditLogs> {
    if (!options?.skipCurrentUser) {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
      entity.actor = currentUser.id ? currentUser.id.toString() : '';
    }
    return super.create(entity, options);
  }

  async createAll(
    entities: DataObject<AuditLogs>[],
    options?: Options,
  ): Promise<AuditLogs[]> {
    if (!options?.skipCurrentUser) {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
      }
      entities.forEach(entity => {
        entity.actor = currentUser.id ? currentUser.id.toString() : '';
      });
    }
    return super.createAll(entities, options);
  }

  async save(entity: AuditLogs, options?: Options): Promise<AuditLogs> {
    throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
  }

  async update(entity: AuditLogs, options?: Options): Promise<void> {
    throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
  }

  async updateAll(
    data: DataObject<AuditLogs>,
    where?: Where<AuditLogs>,
    options?: Options,
  ): Promise<Count> {
    throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
  }

  async updateById(
    id: number,
    data: DataObject<AuditLogs>,
    options?: Options,
  ): Promise<void> {
    throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
  }
  async replaceById(
    id: number,
    data: DataObject<AuditLogs>,
    options?: Options,
  ): Promise<void> {
    throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
  }
}
