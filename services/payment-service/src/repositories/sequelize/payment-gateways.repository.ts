﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {
  SequelizeCrudRepository,
  SequelizeDataSource,
} from '@loopback/sequelize';
import {PaymentDatasourceName} from '../../keys';
import {PaymentGateways} from '../../models';

export class PaymentGatewaysRepository extends SequelizeCrudRepository<
  PaymentGateways,
  typeof PaymentGateways.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: SequelizeDataSource,
  ) {
    super(PaymentGateways, dataSource);
  }
}
