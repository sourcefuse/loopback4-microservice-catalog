import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {SearchServiceConfig} from '..';
import {SearchServiceBindings} from '../keys';
import {SearchQuery} from '../models';

export class SearchQueryRepository extends DefaultCrudRepository<
  SearchQuery,
  typeof SearchQuery.prototype.id
> {
  constructor(
    @inject(`datasources.${SearchServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
    @inject(SearchServiceBindings.Config)
    private readonly config: SearchServiceConfig,
  ) {
    super(SearchQuery, dataSource);
  }
}
