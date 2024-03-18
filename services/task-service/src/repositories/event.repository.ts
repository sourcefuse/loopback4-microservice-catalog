import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {Event} from '../models';
import {TaskDbSourceName} from '../types';
export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject('models.Event')
    private readonly event: typeof Entity & {prototype: Event},
  ) {
    super(event, dataSource);
  }
}
