import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Test} from '../models';
import {inject} from '@loopback/core';
import {CacheMixin} from '../../../mixins';

export class TestWithMixinRepository extends CacheMixin(
  DefaultCrudRepository<Test, number, {}>,
  {
    cachedItemTags: ['TestTag'],
  },
) {
  cacheIdentifier = 'testRepo';
  constructor(@inject('datasources.memorydb') dataSource: juggler.DataSource) {
    super(Test, dataSource);
  }
}
