import {DataObject, Model} from '@loopback/repository';
import {SearchQuery} from '../../models';
import {ColumnMap} from '../../types';
import {SearchQueryBuilder} from '../base';

export class MySqlQueryBuilder<T extends Model> extends SearchQueryBuilder<T> {
  unionString = ' UNION ALL ';
  _placeholderIndex = 0;

  constructor(query: DataObject<SearchQuery>) {
    super(query);
  }

  search(
    model: typeof Model,
    columns: Array<keyof T> | ColumnMap<T>,
    ignoredColumns: (keyof T)[],
  ) {
    const modelName = model.modelName;
    const {columnList, selectors} = this.getColumnListFromArrayOrMap(
      model,
      columns,
      ignoredColumns,
    );
    const where = this.whereBuild(model, this.query.where?.[modelName]);
    const whereClause = [`MATCH (${columnList}) AGAINST (':0')`];
    if (where.sql) {
      whereClause.push(where.sql);
    }
    const query = `SELECT ${selectors}, '${modelName}' as source, MATCH (${columnList}) AGAINST (':0') AS rank from ${modelName} where ${whereClause.join(
      ' AND ',
    )}`;

    this.baseQueryList.push({
      sql: query,
      params: where.params,
    });
  }

  paramString(index: number) {
    return `$${index - 1}`;
  }
}
