// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

import {AuthSecureClient} from '../models';
import {AuthDbSourceName} from '../types';

export class AuthSecureClientRepository extends DefaultSoftCrudRepository<
  AuthSecureClient,
  typeof AuthSecureClient.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(AuthSecureClient, dataSource);
  }
}
