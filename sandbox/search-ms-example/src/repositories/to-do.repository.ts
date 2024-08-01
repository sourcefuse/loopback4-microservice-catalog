// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DATASOURCE_NAME} from '@sourceloop/search-service';
import {DynamicDataSource} from '../datasources';
import {ToDo} from '../models';

export class ToDoRepository extends DefaultCrudRepository<
  ToDo,
  typeof ToDo.prototype.id
> {
  constructor(
    @inject(`datasources.${DATASOURCE_NAME}`)
    dataSource: DynamicDataSource,
  ) {
    super(ToDo, dataSource);
  }
}
