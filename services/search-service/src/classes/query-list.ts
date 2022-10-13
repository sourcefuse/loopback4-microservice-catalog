// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Queries, Query, ShortHandEqualType} from '../types';

export class QueryList {
  queries: Queries;
  constructor(queries?: Queries) {
    if (queries) {
      this.queries = queries;
    } else {
      this.queries = [];
    }
  }
  merge() {
    return this._merge(this.queries);
  }
  add(query?: Query | Queries) {
    if (query) {
      this.queries.push(query);
    }
  }
  private _merge(queries: Queries) {
    let params: ShortHandEqualType[] = [];
    const sqls: string[] = [];
    for (const query of queries) {
      let newQuery: Query;
      if (Array.isArray(query)) {
        newQuery = this._merge(query);
      } else {
        newQuery = query;
      }
      sqls.push(newQuery.sql);
      params = [...params, ...newQuery.params];
    }
    return {
      sql: sqls.join(' AND '),
      params,
    };
  }
}
