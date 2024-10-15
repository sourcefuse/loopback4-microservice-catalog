import {Getter, inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {EventWorkflow} from '../../models';
import {TaskDbSourceName} from '../../types';
export class EventWorkflowRepository extends SequelizeUserModifyCrudRepository<
  EventWorkflow,
  typeof EventWorkflow.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly userGetter: Getter<IAuthUserWithPermissions>,
    @inject('models.EventWorkflow')
    private readonly eventWorkflow: typeof Entity & {prototype: EventWorkflow},
  ) {
    super(eventWorkflow, dataSource, userGetter);
  }
}
