// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

export interface ISearchQuery {
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
  icon?: string;
}
export interface IReturnType {
  rank: number;
  source: string;
}
export interface IDefaultReturnType extends IReturnType {
  name: string;
  description: string;
}

export interface ISearchService<T extends IReturnType> {
  searchApiRequest(
    requestParameters: ISearchQuery,
    saveInRecents: boolean,
  ): Observable<T[]>;
  recentSearchApiRequest?(): Observable<ISearchQuery[]>;
}

export interface ISearchServiceWithPromises<T extends IReturnType> {
  searchApiRequestWithPromise(
    requestParameters: ISearchQuery,
    saveInRecents: boolean,
  ): Promise<T[]>;
  recentSearchApiRequestWithPromise?(): Promise<ISearchQuery[]>;
}

export function isApiServiceWithPromise(
  service:
    | ISearchService<IReturnType>
    | ISearchServiceWithPromises<IReturnType>,
): service is ISearchServiceWithPromises<IReturnType> {
  return !!(service as ISearchServiceWithPromises<IReturnType>)
    .searchApiRequestWithPromise;
}

// cant use T extends IReturnType here
export const SEARCH_SERVICE_TOKEN: InjectionToken<ISearchService<IReturnType>> =
  new InjectionToken<ISearchService<IReturnType>>('Search_Service_Token');

export type RecentSearchEvent = {
  event?: Event;
  keyword: string;
  category: string;
};

export type ItemClickedEvent<T> = {
  event: MouseEvent;
  item: T;
};

export type TypeEvent = {
  event?: Event;
  input: string;
};
// IRequestParameters default values
export const DEFAULT_LIMIT = 20;
export const DEFAULT_LIMIT_TYPE = false;
export const DEFAULT_ORDER = [];
export const DEBOUNCE_TIME = 1000;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_SAVE_IN_RECENTS = true;
