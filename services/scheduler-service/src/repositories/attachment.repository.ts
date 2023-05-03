// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SchedulerDatasourceName} from '../keys';
import {Attachment, AttachmentRelations, Event} from '../models';
import {AuditLogRepository} from './audit.repository';
import {EventRepository} from './event.repository';

const AttachementAuditOpts: IAuditMixinOptions = {
  actionKey: 'Attachement_Logs',
};

export class AttachmentRepository extends ConditionalAuditRepositoryMixin(
  DefaultUserModifyCrudRepository<
    Attachment,
    typeof Attachment.prototype.id,
    AttachmentRelations
  >,
  AttachementAuditOpts,
) {
  public readonly event: BelongsToAccessor<
    Event,
    typeof Attachment.prototype.id
  >;

  constructor(
    @inject(`datasources.${SchedulerDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('EventRepository')
    protected eventRepositoryGetter: Getter<EventRepository>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(Attachment, dataSource, getCurrentUser);
    this.event = this.createBelongsToAccessorFor(
      'event',
      eventRepositoryGetter,
    );
    this.registerInclusionResolver('event', this.event.inclusionResolver);
  }
}
