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
import {Transactions} from '../../models/tenant-support';

export class TransactionsRepository extends SequelizeCrudRepository<
  Transactions,
  typeof Transactions.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: SequelizeDataSource,
    @inject(`models.Transactions`)
    private readonly transactions: typeof Entity & {prototype: Transactions},
  ) {
    super(transactions, dataSource);
  }
}
