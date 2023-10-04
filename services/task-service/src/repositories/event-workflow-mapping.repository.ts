import {juggler} from '@loopback/repository';
import {EventWorkflows} from '../models';
import {Getter, inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

export class EventWorkflowMappingRepository extends DefaultUserModifyCrudRepository<
  EventWorkflows,
  typeof EventWorkflows.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(EventWorkflows, dataSource, getCurrentUser);
  }
}
