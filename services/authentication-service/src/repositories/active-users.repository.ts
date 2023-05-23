import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {AuthDbSourceName} from '../types';
import {ActiveUsers} from '../models';
import {inject} from '@loopback/core';

export class ActiveUsersRepository extends DefaultCrudRepository<
  ActiveUsers,
  typeof ActiveUsers.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(ActiveUsers, dataSource);
  }
}
