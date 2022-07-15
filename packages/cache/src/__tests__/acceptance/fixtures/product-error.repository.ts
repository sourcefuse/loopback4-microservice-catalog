// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CacheManager} from '../../..';
import {Product, ProductRelations} from './product.model';
import {TestDataSource} from './test.datasource';

export class ProductErrorRepository extends CacheManager.CacheRepositoryMixin<
  Product,
  typeof Product.prototype.id,
  ProductRelations,
  Constructor<
    DefaultCrudRepository<
      Product,
      typeof Product.prototype.id,
      ProductRelations
    >
  >
>(DefaultCrudRepository, {
  prefix: 'product',
  ttl: 5000,
}) {
  constructor(dataSource: TestDataSource) {
    super(Product, dataSource);
  }
}
