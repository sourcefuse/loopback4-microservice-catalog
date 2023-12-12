import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ApiKey} from '../../../models';
import {TaskDbSourceName} from '../../../types';

export class ApiKeyRepository extends DefaultCrudRepository<
  ApiKey,
  typeof ApiKey.prototype.id
> {
  constructor(
    @inject(`datasources.${TaskDbSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(ApiKey, dataSource);
  }
}
