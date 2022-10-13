// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Feature} from '../models';
import {FeatureToggleDbName} from '../types';

export class FeatureRepository extends DefaultUserModifyCrudRepository<
  Feature,
  typeof Feature.prototype.name
> {
  constructor(
    @inject(`datasources.${FeatureToggleDbName}`)
    dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Feature, dataSource, getCurrentUser);
  }
}
