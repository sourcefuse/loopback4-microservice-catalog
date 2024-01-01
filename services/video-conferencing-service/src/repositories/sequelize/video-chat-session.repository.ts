// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {VideoConfDatasource} from '../../keys';
import {
  VideoChatSession,
  VideoChatSessionRelation,
} from '../../models/video-chat-session.model';
import {AuditLogRepository} from './audit.repository';

const VideoChatSessionAuditOpts: IAuditMixinOptions = {
  actionKey: 'Video_Chat_Session_Logs',
};
export class VideoChatSessionRepository extends ConditionalAuditRepositoryMixin(
  SequelizeUserModifyCrudRepository<
    VideoChatSession,
    typeof VideoChatSession.prototype.id,
    VideoChatSessionRelation
  >,
  VideoChatSessionAuditOpts,
) {
  constructor(
    @inject(`datasources.${VideoConfDatasource}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(VideoChatSession, dataSource, getCurrentUser);
  }
}
