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
import {Orders} from '../../models/tenant-support';

@tenantGuard()
export class OrdersRepository extends SequelizeCrudRepository<
  Orders,
  typeof Orders.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: SequelizeDataSource,
    @inject(`models.Orders`)
    private readonly orders: typeof Entity & {prototype: Orders},
  ) {
    super(orders, dataSource);
  }
}
