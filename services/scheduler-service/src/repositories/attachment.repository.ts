import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SchedulerDatasourceName} from '../keys';
import {Attachment, AttachmentRelations, Event} from '../models';
import {EventRepository} from './event.repository';

export class AttachmentRepository extends DefaultUserModifyCrudRepository<
  Attachment,
  typeof Attachment.prototype.id,
  AttachmentRelations
> {
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
  ) {
    super(Attachment, dataSource, getCurrentUser);
    this.event = this.createBelongsToAccessorFor(
      'event',
      eventRepositoryGetter,
    );
    this.registerInclusionResolver('event', this.event.inclusionResolver);
  }
}
