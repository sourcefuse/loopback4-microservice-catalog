import {DefaultKeyValueRepository} from '@loopback/repository';
import {Product} from './product.model';
import {RedisDataSource} from './redis.datasource';

export class ProductRedisRepository extends DefaultKeyValueRepository<Product> {
  constructor(dataSource: RedisDataSource) {
    super(Product, dataSource);
  }
}
