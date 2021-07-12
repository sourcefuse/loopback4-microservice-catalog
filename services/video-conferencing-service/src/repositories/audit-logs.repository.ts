import {Getter, inject} from '@loopback/core';
import {
  Count,
  DataObject,
  DefaultCrudRepository,
  Options,
  Where,
  juggler,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthenticationBindings} from 'loopback4-authentication';
import {AuthorizeErrorKeys} from 'loopback4-authorization';
import {AuditLogs} from '../models';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {VideoConfDatasource} from '../keys';

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
