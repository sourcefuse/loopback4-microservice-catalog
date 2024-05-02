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
import {tenantGuard} from '@sourceloop/core';
import {PaymentDatasourceName} from '../../keys';
import {PaymentGateways} from '../../models/tenant-support';

@tenantGuard()
export class PaymentGatewaysRepository extends SequelizeCrudRepository<
  PaymentGateways,
  typeof PaymentGateways.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: SequelizeDataSource,
    @inject(`models.PaymentGateways`)
    private readonly paymentGateways: typeof Entity & {
      prototype: PaymentGateways;
    },
  ) {
    super(paymentGateways, dataSource);
  }
}
