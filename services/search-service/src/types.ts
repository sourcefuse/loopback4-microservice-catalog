import {Constructor} from '@loopback/core';
import {DataObject, Model} from '@loopback/repository';
import {SearchResult} from './models';
import {SearchQuery} from './models/search-query.model';

export type SearchFunctionType<T> = (
  query: DataObject<SearchQuery>,
) => Promise<T[]>;

export type SearchableModelsService = {
  add: (model: typeof Model) => Promise<void>;
  delete: (model: typeof Model) => Promise<void>;
  get: () => Promise<typeof Model[]>;
};

export interface Searchable {
  name: string;
  description: string;
}

export type SearchableModelsList<T extends Model> = (
  | SearchableModel<T>
  | typeof Model
)[];
export interface SearchServiceConfig<T extends Model = SearchResult> {
  useCustomSequence?: boolean;
  models: SearchableModelsList<T>;
  type?: Constructor<T> & typeof Model;
  controller?: SearchControllerConfig;
}

export type SearchControllerConfig = {
  name?: string;
  basePath: string;
  authorizations?: string[];
};

export class SearchableModel<T extends Model> {
  model: typeof Model;
  columns: ColumnMap<T>;
}

export function isSearchableModel<T extends Model>(
  arg: SearchableModel<T> | typeof Model,
): arg is SearchableModel<T> {
  return !!(arg as SearchableModel<T>).model;
}

export type ColumnMap<T> = {
  [key in keyof T]+?: string;
};
