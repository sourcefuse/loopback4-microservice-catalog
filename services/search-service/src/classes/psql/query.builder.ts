import {AnyObject, DataObject, Model} from '@loopback/repository';
import {SearchQuery} from '../../models';
import {ColumnMap} from '../../types';
import {SearchQueryBuilder} from '../base';

export class PsqlQueryBuilder<T extends Model> extends SearchQueryBuilder<T> {
  unionString = ' UNION ALL ';
  schema: string;

  constructor(query: DataObject<SearchQuery>, schema?: string) {
    super(query, schema);
  }

  search(model: string, columns: Array<keyof T> | ColumnMap<T>) {
    let selectors: string, columnList: string;
    if (Array.isArray(columns)) {
      columnList = columns.join(" || ' ' || ");
      selectors = columns.join(', ');
    } else {
      columnList = Object.values(columns).join(" || ' ' || ");
      selectors = Object.keys(columns)
        .map(column => `${(columns as AnyObject)[column]} as ${column}`)
        .join(', ');
    }

    this.baseQueryList.push(
      `SELECT ${selectors}, '${model}' as source, ts_rank_cd(to_tsvector(${columnList}), to_tsquery($1)) as rank from ${
        this.schema || 'public'
      }.${model} where to_tsvector(${columnList}) @@ to_tsquery($1)`,
    );
  }
}
