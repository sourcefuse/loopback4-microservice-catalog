// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {tenantGuard} from '@sourceloop/core';
import {PaymentDatasourceName} from '../keys';
import {PaymentGateways} from '../models/tenant-support';

@tenantGuard()
export class PaymentGatewaysRepository extends DefaultCrudRepository<
  PaymentGateways,
  typeof PaymentGateways.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject(`models.PaymentGateways`)
    private readonly paymentGateways: typeof Entity & {
      prototype: PaymentGateways;
    },
  ) {
    super(paymentGateways, dataSource);
  }
}
