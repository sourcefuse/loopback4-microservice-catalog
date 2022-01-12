import {Where} from '@loopback/filter';
import {Entity} from '@loopback/repository';
import {ModelConstructor} from '../..';

export declare type PredicateValueType<PT> = PT | PT[] | [PT, PT];

export declare type ShortHandEqualType = string | number | boolean | Date;

export type FromClause = FromJoinClause | FromTableClause;

export type FromJoinClause = {
  sql: string;
  prefix: string;
  type: 'join';
};

export type FromTableClause = {
  sql: string;
  type: 'table';
};

export type Query = {
  sql: string;
  params: ShortHandEqualType[];
};

export type Queries = (Query | Queries)[];

export class QueryList {
  queries: Queries;
  constructor(queries?: Queries) {
    if (queries) {
      this.queries = queries;
    } else {
      this.queries = [];
    }
  }
  merge(using = ' AND ') {
    return this._merge(this.queries, using);
  }
  add(query?: Query | Queries) {
    if (query) {
      this.queries.push(query);
    }
  }
  private _merge(queries: Queries, joinStr: string) {
    let params: ShortHandEqualType[] = [];
    const sqls: string[] = [];
    for (const query of queries) {
      let newQuery: Query;
      if (Array.isArray(query)) {
        newQuery = this._merge(query, joinStr);
      } else {
        newQuery = query;
      }
      sqls.push(newQuery.sql);
      params = [...params, ...newQuery.params];
    }
    return {
      sql: sqls.join(joinStr),
      params,
    };
  }
}

export type WhereBuilderFunction = <T extends Entity>(
  prefix: string,
  model: ModelConstructor<T>,
  where?: Where<T>,
  idType?: string,
  paramBuilder?: (i: number) => string,
) => Query;

export type BuilderConfig = {
  schema: string;
  idType: string;
};
