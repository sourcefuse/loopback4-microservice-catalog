﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/authentication-service';
import {AuthDbDataSource} from '../datasources';
import {ToDo} from '../models';

export class ToDoRepository extends DefaultCrudRepository<
  ToDo,
  typeof ToDo.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: AuthDbDataSource,
  ) {
    super(ToDo, dataSource);
  }
}
