import {juggler} from '@loopback/repository';
import {Getter, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SessionAttendees} from '../models/session-attendees.model';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourceloop/core';

export class SessionAttendeesRepository extends DefaultUserModifyCrudRepository<
  SessionAttendees,
  typeof SessionAttendees.prototype.id
> {
  constructor(
    @inject('datasources.videochatDb') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(SessionAttendees, dataSource, getCurrentUser);
  }
}
