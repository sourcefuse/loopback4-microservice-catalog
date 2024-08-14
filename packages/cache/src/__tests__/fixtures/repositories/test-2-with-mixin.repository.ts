import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Test} from '../models';
import {inject} from '@loopback/core';
import {CacheMixin} from '../../../mixins';

export class Test2WithMixinRepository extends CacheMixin(
  DefaultCrudRepository<Test, number, {}>,
  {
    invalidationTags: ['TestTag', 'Test2Tag'],
    cachedItemTags: ['Test2Tag'],
  },
) {
  cacheIdentifier = 'testRepo2';
  constructor(@inject('datasources.memorydb2') dataSource: juggler.DataSource) {
    super(Test, dataSource);
  }
}
