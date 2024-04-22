// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {PaymentDatasourceName} from '../../keys';
import {Subscriptions} from '../../models/tenant-support';

export class SubscriptionsRepository extends SequelizeCrudRepository<
  Subscriptions,
  typeof Subscriptions.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: SequelizeDataSource,
    @inject(`models.Subscriptions`)
    private readonly subscriptions: typeof Entity & {
      prototype: Subscriptions;
    },
  ) {
    super(subscriptions, dataSource);
  }
}
