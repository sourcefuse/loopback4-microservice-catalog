import {juggler} from '@loopback/repository';
import {EventWorkflowMapping} from '../models';
import {Getter, inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

export class EventWorkflowMappingRepository extends DefaultUserModifyCrudRepository<
  EventWorkflowMapping,
  typeof EventWorkflowMapping.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(EventWorkflowMapping, dataSource, getCurrentUser);
  }
}
