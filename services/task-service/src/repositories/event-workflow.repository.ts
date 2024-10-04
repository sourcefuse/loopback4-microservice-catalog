import {Getter, inject} from '@loopback/core';
import {Entity, juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {EventWorkflow} from '../models';
import {TaskDbSourceName} from '../types';

export class EventWorkflowRepository extends DefaultUserModifyCrudRepository<
  EventWorkflow,
  typeof EventWorkflow.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly userGetter: Getter<IAuthUserWithPermissions>,
    @inject('models.EventWorkflow')
    private readonly eventWorkflow: typeof Entity & {prototype: EventWorkflow},
  ) {
    super(eventWorkflow, dataSource, userGetter);
  }
}
