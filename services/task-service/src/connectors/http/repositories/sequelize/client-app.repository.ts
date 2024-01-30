import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {TaskDbSourceName} from '../../../../types';
import {ClientApp} from '../../models';
export class ClientAppRepository extends SequelizeCrudRepository<
  ClientApp,
  typeof ClientApp.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: SequelizeDataSource,
  ) {
    super(ClientApp, dataSource);
  }
}
