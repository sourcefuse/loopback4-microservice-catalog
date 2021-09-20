import {Model} from '@loopback/repository';
import {SearchFunctionType, SearchServiceConfig} from '../types';

export interface SearchControllerBase<T extends Model> {
  readonly searchFn: SearchFunctionType<T>;
  readonly config: SearchServiceConfig;

  /**
   * Implementation of the endpoint `GET /search`.
   * @param query search query
   */
  search(
    query: string,
    limit?: number,
    order?: string,
    limitByType?: boolean,
  ): Promise<T[]>;
}

export interface SearchControllerCtor<T extends Model> {
  new (
    config: SearchServiceConfig,
    searchFn: SearchFunctionType<T>,
  ): SearchControllerBase<T>;
}
