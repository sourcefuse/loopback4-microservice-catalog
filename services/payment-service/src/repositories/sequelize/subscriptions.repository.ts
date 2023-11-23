// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {PaymentDatasourceName} from '../../keys';
import {Subscriptions} from '../../models';

export class SubscriptionsRepository extends SequelizeCrudRepository<
  Subscriptions,
  typeof Subscriptions.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: SequelizeDataSource,
  ) {
    super(Subscriptions, dataSource);
  }
}
