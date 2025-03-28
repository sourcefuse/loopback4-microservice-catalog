import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {CacheMixin} from '../../../mixins';
import {Test2} from '../models';

export class Test2WithMixinRepository extends CacheMixin(
  DefaultCrudRepository<Test2, number, {}>,
  {
    invalidationTags: ['TestTag', 'Test2Tag'],
    cachedItemTags: ['Test2Tag'],
  },
) {
  cacheIdentifier = 'testRepo2';
  constructor(@inject('datasources.memorydb2') dataSource: juggler.DataSource) {
    super(Test2, dataSource);
  }
}
