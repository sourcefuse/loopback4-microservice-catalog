import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {SchedulerBindings} from '../keys';
import {Attachment, AttachmentRelations, Event} from '../models';
import {EventRepository} from './event.repository';

export class AttachmentRepository extends DefaultCrudRepository<
  Attachment,
  typeof Attachment.prototype.id,
  AttachmentRelations
> {
  public readonly event: BelongsToAccessor<
    Event,
    typeof Attachment.prototype.id
  >;

  constructor(
    @inject(SchedulerBindings.dbConnector) dataSource: juggler.DataSource,
    @repository.getter('EventRepository')
    protected eventRepositoryGetter: Getter<EventRepository>,
  ) {
    super(Attachment, dataSource);
    this.event = this.createBelongsToAccessorFor(
      'event',
      eventRepositoryGetter,
    );
    this.registerInclusionResolver('event', this.event.inclusionResolver);
  }
}
