import {inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {Event} from '../../models';
import {TaskDbSourceName} from '../../types';
export class EventRepository extends SequelizeCrudRepository<
  Event,
  typeof Event.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject('models.Event')
    private readonly event: typeof Entity & {prototype: Event},
  ) {
    super(event, dataSource);
  }
}
