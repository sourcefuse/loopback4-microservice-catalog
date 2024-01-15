import {Getter, inject} from '@loopback/core';
import {Entity, juggler} from '@loopback/repository';
import {DefaultUserModifyCrudRepository} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {IAuthUserWithPermissions} from 'loopback4-authorization';
import {Event} from '../models';
import {TaskDbSourceName} from '../types';
export class EventRepository extends DefaultUserModifyCrudRepository<
  Event,
  typeof Event.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private userGetter: Getter<IAuthUserWithPermissions>,
    @inject('models.Event')
    private readonly event: typeof Entity & {prototype: Event},
  ) {
    super(event, dataSource, userGetter);
  }
}
