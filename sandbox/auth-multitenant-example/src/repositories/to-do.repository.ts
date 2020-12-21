import {DefaultCrudRepository} from '@loopback/repository';
import {ToDo} from '../models';
import {PgdbDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {AuthDbSourceName} from '@sourceloop/authentication-service';

export class ToDoRepository extends DefaultCrudRepository<
  ToDo,
  typeof ToDo.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PgdbDataSource,
  ) {
    super(ToDo, dataSource);
  }
}
