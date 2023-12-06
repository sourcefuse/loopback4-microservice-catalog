// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {AuthSecureClient} from '../../models';
import {AuthDbSourceName} from '../../types';

export class AuthSecureClientRepository extends SequelizeSoftCrudRepository<
  AuthSecureClient,
  typeof AuthSecureClient.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: SequelizeDataSource,
  ) {
    super(AuthSecureClient, dataSource);
  }
}
