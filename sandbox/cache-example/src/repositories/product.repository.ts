import {Constructor, Getter, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CacheManager} from '@sourceloop/cache';
import {CacheDbDataSource, DbDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';

export class ProductRepository extends CacheManager.CacheRepositoryMixin<
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
  ttl: 50000,
}) {
  redisDataSource: CacheDbDataSource;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter('datasources.cacheDb')
    public getCacheDataSource: Getter<CacheDbDataSource>,
  ) {
    super(Product, dataSource);
  }
}
