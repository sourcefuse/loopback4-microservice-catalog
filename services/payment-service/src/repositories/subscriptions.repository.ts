// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {PaymentDatasourceName} from '../keys';
import {Subscriptions} from '../models';

export class SubscriptionsRepository extends DefaultCrudRepository<
  Subscriptions,
  typeof Subscriptions.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Subscriptions, dataSource);
  }
}
