import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

export interface IRecentSearchResult {
  match: string;
  limit: number | null;
  order: string | null;
  limitByType: boolean | null;
  offset: number | null;
  sources: string[] | null;
}
export interface IModel {
  name: string;
  displayName: string;
  imageUrl?: string;
}
export interface IReturnType {
  rank: number;
  source: string;
}
export interface IDefaultReturnType extends IReturnType {
  name: string;
  description: string;
}

export interface IRequestParameters {
  //here not null as there are default values if nothing is passed for these in config.
  match: string;
  source: 'All' | IModel;
  limit: number;
  limitByType: boolean;
  order: string;
  offset: number;
  saveInRecents: boolean;
}

export interface ISearchService<T extends IReturnType> {
  searchApiRequest(requestParameters: IRequestParameters): Observable<T[]>;
  recentSearchApiRequest?(): Observable<IRecentSearchResult[]>;
}

//cant use T extends IReturnType here
export const SEARCH_SERVICE_TOKEN: InjectionToken<ISearchService<IReturnType>> =
  new InjectionToken<ISearchService<IReturnType>>('Search_Service_Token');

//IRequestParameters default values
export const DEFAULT_LIMIT = 20;
export const DEFAULT_LIMIT_TYPE = false;
export const DEFAULT_ORDER = [];
export const DEBOUNCE_TIME = 1000;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_SAVE_IN_RECENTS = true;
