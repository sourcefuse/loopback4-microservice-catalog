import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Events} from '../models';
import {inject} from '@loopback/core';
import {TaskDbSourceName} from '../types';

export class EventRepository extends DefaultCrudRepository<
  Events,
  typeof Events.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    // @inject.getter(AuthenticationBindings.CURRENT_USER)
    // protected readonly getCurrentUser: Getter<
    //   IAuthUserWithPermissions | undefined
    // >,
  ) {
    super(Events, dataSource);
  }
}
