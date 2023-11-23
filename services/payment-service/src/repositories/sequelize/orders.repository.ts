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
import {Orders} from '../../models';
export class OrdersRepository extends SequelizeCrudRepository<
  Orders,
  typeof Orders.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: SequelizeDataSource,
  ) {
    super(Orders, dataSource);
  }
}
