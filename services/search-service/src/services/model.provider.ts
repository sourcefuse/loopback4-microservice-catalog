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
  /**
   * The function returns a ModelProviderFn that asynchronously builds a query and parameters based on
   * search criteria and model configuration.
   * @returns The `value()` function returns a ModelProviderFn, which is an asynchronous function that
   * takes a `search` object and a `queryBuilder` object as parameters. Inside the function, it filters
   * models based on the search criteria, builds a query and parameters using the queryBuilder, and
   * returns an object containing the query and params.
   */
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
