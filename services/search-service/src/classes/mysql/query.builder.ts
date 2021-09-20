import {AnyObject, DataObject, Model} from '@loopback/repository';
import {SearchQuery} from '../../models';
import {ColumnMap} from '../../types';
import {SearchQueryBuilder} from '../base';

export class MySqlQueryBuilder<T extends Model> extends SearchQueryBuilder<T> {
  unionString = ' UNION ALL ';

  constructor(query: DataObject<SearchQuery>) {
    super(query);
  }

  search(model: string, columns: Array<keyof T> | ColumnMap<T>) {
    let selectors: string, columnList: string;
    if (Array.isArray(columns)) {
      columnList = columns.join(', ');
      selectors = columns.join(', ');
    } else {
      columnList = Object.values(columns).join(', ');
      selectors = Object.keys(columns)
        .map(column => `${(columns as AnyObject)[column]} as ${column}`)
        .join(', ');
    }
    this.baseQueryList.push(
      `SELECT ${selectors}, '${model}' as source, MATCH (${columnList}) AGAINST (':0') AS rank from ${model} where MATCH (${columnList}) AGAINST (':0')`,
    );
  }
}
