import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {TaskDbSourceName} from '../../../types';
import {ClientApp} from '../models';

export class ClientAppRepository extends DefaultCrudRepository<
  ClientApp,
  typeof ClientApp.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(ClientApp, dataSource);
  }
}
