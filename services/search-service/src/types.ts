// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor} from '@loopback/core';
import {AnyObject, Model} from '@loopback/repository';
import {SearchResult} from './models';
import {SearchQuery} from './models/search-query.model';

export type SearchFunctionType<T> = (query: SearchQuery) => Promise<T[]>;

export type SearchableModelsService = {
  add: (model: typeof Model) => Promise<void>;
  delete: (model: typeof Model) => Promise<void>;
  get: () => Promise<(typeof Model)[]>;
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
  doNotMountCoreComponent?: boolean;
  models: SearchableModelsList<T>;
  type?: Constructor<T> & typeof Model;
  ignoreColumns?: ModelProperties<T>[];
  controller?: SearchControllerConfig;
}

export type ModelProperties<T extends Model> = keyof Partial<
  Omit<T, 'toJSON' | 'toObject' | 'getId' | 'getIdObject'>
>;

export type SearchControllerConfig = {
  name?: string;
  basePath: string;
  authorizations?: string[];
  authenticate?: boolean;
  recentCount?: number;
  recents?: boolean;
};

export class SearchableModel<
  T extends Model,
  S extends typeof Model = typeof Model,
> {
  model: S;
  columns: ColumnMap<T>;
  identifier?: string;
}

export function isSearchableModel<T extends Model>(
  arg: SearchableModel<T> | typeof Model,
): arg is SearchableModel<T> {
  return !!(arg as SearchableModel<T>).model;
}

export type ColumnMap<T extends Model> = {
  [key in ModelProperties<T>]+?: string;
};

export type SearchWhereFilterMap = {
  [key: string]: SearchWhereFilter;
};

export declare type SearchWhereFilter<MT extends object = AnyObject> =
  | Condition<MT>
  | AndClause<MT>
  | OrClause<MT>;
export interface AndClause<MT extends object> {
  and: SearchWhereFilter<MT>[];
}
export interface OrClause<MT extends object> {
  or: SearchWhereFilter<MT>[];
}

export declare type Condition<MT extends object> = {
  [P in keyof MT]?: PredicateComparison<MT[P]> | (MT[P] & ShortHandEqualType);
};

export declare type PredicateComparison<PT> = {
  eq?: PT;
  neq?: PT;
  gt?: PT;
  gte?: PT;
  lt?: PT;
  lte?: PT;
  inq?: PT[];
  nin?: PT[];
  between?: [PT, PT];
};

export declare type PredicateValueType<PT> = PT | PT[] | [PT, PT];

export declare type ShortHandEqualType = string | number | boolean | Date;

export type Query = {
  sql: string;
  params: ShortHandEqualType[];
};

export type Queries = (Query | Queries)[];
