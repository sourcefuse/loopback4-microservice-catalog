// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  IDefaultReturnType,
  ISearchQuery,
  ISearchService,
} from '@sourceloop/search-client';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService implements ISearchService<IDefaultReturnType> {
  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService,
  ) {}
  searchApiRequest(
    requestParameters: ISearchQuery,
    saveInRecents: boolean,
  ): Observable<IDefaultReturnType[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.get('token')}`,
      }),
    };
    let url = '';

    url = `http://localhost:3000/search?query[match]=${requestParameters.match}`;
    url += `&query[limit]=${requestParameters.limit}`;
    url += `&query[limitByType]=${requestParameters.limitByType}`;
    url += `&query[order]=${requestParameters.order}`;
    url += `&saveInRecents=${saveInRecents}`;

    if (requestParameters.sources?.length) {
      url = url + `&query[sources][0]=${requestParameters.sources}`;
    }

    return this.http.get<Array<IDefaultReturnType>>(url, httpOptions);
  }
  recentSearchApiRequest(): Observable<ISearchQuery[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.get('token')}`,
      }),
    };
    return this.http.get<Array<ISearchQuery>>(
      `http://localhost:3000/search/recents`,
      httpOptions,
    );
  }
}
