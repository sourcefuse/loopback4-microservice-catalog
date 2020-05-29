import {Getter, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {VideochatDbDataSource} from '../datasources/videochat-db.datasource';
import {VideoChatSession} from '../models/video-chat-session.model';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourcefuse-service-catalog/core';

export class VideoChatSessionRepository extends DefaultUserModifyCrudRepository<
  VideoChatSession,
  typeof VideoChatSession.prototype.id
> {
  constructor(
    @inject('datasources.videochatDb') dataSource: VideochatDbDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(VideoChatSession, dataSource, getCurrentUser);
  }
}
