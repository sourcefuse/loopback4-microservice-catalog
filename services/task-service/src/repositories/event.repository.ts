import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Events} from '../models';
import {inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';

export class EventRepository extends DefaultCrudRepository<
  Events,
  typeof Events.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Events, dataSource);
  }
}
