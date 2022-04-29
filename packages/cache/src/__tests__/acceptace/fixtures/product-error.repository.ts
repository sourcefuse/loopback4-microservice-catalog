import {Constructor} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CacheRespositoryMixin} from '../../..';
import {Product, ProductRelations} from './product.model';
import {TestDataSource} from './test.datasource';

export class ProductErrorRepository extends CacheRespositoryMixin<
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
>(DefaultCrudRepository, {prefix: 'product', ttl: 5000}) {
  constructor(dataSource: TestDataSource) {
    super(Product, dataSource);
  }
}
