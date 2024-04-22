// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {PaymentDatasourceName} from '../keys';
import {Transactions} from '../models/tenant-support';

export class TransactionsRepository extends DefaultCrudRepository<
  Transactions,
  typeof Transactions.prototype.id
> {
  constructor(
    @inject(`datasources.${PaymentDatasourceName}`)
    dataSource: juggler.DataSource,
    @inject(`models.Transactions`)
    private readonly transactions: typeof Entity & {prototype: Transactions},
  ) {
    super(transactions, dataSource);
  }
}
