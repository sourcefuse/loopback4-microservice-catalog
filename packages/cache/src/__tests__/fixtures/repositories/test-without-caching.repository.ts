import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Test} from '../models';
import {BindingScope, inject, injectable} from '@loopback/core';

@injectable({scope: BindingScope.SINGLETON})
export class TestWithoutCachingRepository extends DefaultCrudRepository<
  Test,
  number,
  {}
> {
  constructor(@inject('datasources.memorydb') dataSource: juggler.DataSource) {
    super(Test, dataSource);
  }
}
