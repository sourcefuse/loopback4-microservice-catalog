import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {EventModel} from '../models';
import {Getter, inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

export class EventRepository extends DefaultCrudRepository<
  EventModel,
  typeof EventModel.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    // @inject.getter(AuthenticationBindings.CURRENT_USER)
    // protected readonly getCurrentUser: Getter<
    //   IAuthUserWithPermissions | undefined
    // >,
  ) {
    super(EventModel, dataSource);
  }
}
