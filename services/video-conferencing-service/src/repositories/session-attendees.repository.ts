import {juggler, DefaultCrudRepository} from '@loopback/repository';
import {inject} from '@loopback/core';
import {SessionAttendees} from '../models/session-attendees.model';

export class SessionAttendeesRepository extends DefaultCrudRepository<
  SessionAttendees,
  typeof SessionAttendees.prototype.id
> {
  constructor(
    @inject('datasources.videochatDb') dataSource: juggler.DataSource,
  ) {
    super(SessionAttendees, dataSource);
  }
}
