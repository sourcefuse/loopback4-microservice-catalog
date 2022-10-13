// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor, Getter, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CacheManager} from '@sourceloop/cache';
import {CacheDbDataSource, DbDataSource} from '../datasources';
import {Product} from '../models';

export class ProductRepository extends CacheManager.CacheRepositoryMixin<
  Product,
  typeof Product.prototype.id,
  {},
  Constructor<DefaultCrudRepository<Product, typeof Product.prototype.id, {}>>
>(DefaultCrudRepository, {
  prefix: 'product',
  ttl: 50000,
}) {
  redisDataSource: CacheDbDataSource;
  constructor(
    @inject('datasources.db') readonly dataSource: DbDataSource,
    @inject.getter('datasources.cacheDb')
    public readonly getCacheDataSource: Getter<CacheDbDataSource>,
  ) {
    super(Product, dataSource);
  }
}
