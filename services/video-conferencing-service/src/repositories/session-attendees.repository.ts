// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {juggler, repository} from '@loopback/repository';
import {
  AuditLogRepository,
  ConditionalAuditRepositoryMixin,
  IAuditMixinOptions,
} from '@sourceloop/audit-log';
import {DefaultUserModifyCrudRepository} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {VideoConfDatasource} from '../keys';
import {SessionAttendees} from '../models/session-attendees.model';

const SessionAttendeesAuditOpts: IAuditMixinOptions = {
  actionKey: 'Session_Attendees_Logs',
};

export class SessionAttendeesRepository extends ConditionalAuditRepositoryMixin(
  DefaultUserModifyCrudRepository<
    SessionAttendees,
    typeof SessionAttendees.prototype.id,
    {}
  >,
  SessionAttendeesAuditOpts,
) {
  constructor(
    @inject(`datasources.${VideoConfDatasource}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
  ) {
    super(SessionAttendees, dataSource, getCurrentUser);
  }
}
