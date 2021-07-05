import {juggler} from '@loopback/repository';
import {Getter, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {VideoChatSession} from '../models/video-chat-session.model';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourceloop/core';
import {VideoConfDatasource} from '../keys';

export class VideoChatSessionRepository extends DefaultUserModifyCrudRepository<
  VideoChatSession,
  typeof VideoChatSession.prototype.id
> {
  constructor(
    @inject(`datasources.${VideoConfDatasource}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(VideoChatSession, dataSource, getCurrentUser);
  }
}
