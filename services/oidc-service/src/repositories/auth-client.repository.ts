﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

import {AuthClient} from '../models';
import {AuthDbSourceName} from '../types';

export class AuthClientRepository extends DefaultSoftCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(AuthClient, dataSource);
  }
}
