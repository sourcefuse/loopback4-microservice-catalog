// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {PaymentDatasourceName} from '../keys';
import {Subscriptions} from '../models/tenant-support';

export class SubscriptionsRepository extends DefaultCrudRepository<
  Subscriptions,
  typeof Subscriptions.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject(`models.Subscriptions`)
    private readonly subscriptions: typeof Entity & {
      prototype: Subscriptions;
    },
  ) {
    super(subscriptions, dataSource);
  }
}
