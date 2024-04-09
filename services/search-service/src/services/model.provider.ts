import {BindingScope, Provider, inject, injectable} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import {SearchServiceBindings} from '../keys';
import {SearchQuery, SearchResult} from '../models';
import {SearchServiceConfig, isSearchableModel} from '../types';
export type ModelProviderFn = (
  search: SearchQuery,
  queryBuilder: AnyObject,
) => Promise<{query: string; params: AnyObject}>;
@injectable({scope: BindingScope.SINGLETON})
export class SearchModelProvider implements Provider<ModelProviderFn> {
  constructor(
    @inject(SearchServiceBindings.Config)
    private readonly config: SearchServiceConfig,
  ) {}
  value(): ModelProviderFn {
    return async (search: SearchQuery, queryBuilder: AnyObject) => {
      let models;
      if (search.sources && search.sources.length > 0) {
        const sources = search.sources;
        models = this.config.models.filter(model => {
          if (isSearchableModel(model)) {
            return sources.includes(model.identifier ?? model.model.modelName);
          } else {
            return sources.includes(model.modelName);
          }
        });
      } else {
        models = this.config.models;
      }
      const type = this.config.type ?? SearchResult;

      const {query, params} = await queryBuilder.build(
        models,
        this.config.ignoreColumns,
        type,
      );
      return {query, params};
    };
  }
}
