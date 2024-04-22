// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {tenantGuard} from '@sourceloop/core';
import {PaymentDatasourceName} from '../keys';
import {Orders} from '../models/tenant-support';

@tenantGuard()
export class OrdersRepository extends DefaultCrudRepository<
  Orders,
  typeof Orders.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject(`models.Orders`)
    private readonly orders: typeof Entity & {prototype: Orders},
  ) {
    super(orders, dataSource);
  }
}
