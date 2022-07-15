// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
    const tableName = this.getTableName(model);
    const sourceName = this.getModelName(model);
    const {columnList, selectors} = this.getColumnListFromArrayOrMap(
      model,
      columns,
      ignoredColumns,
    );
    const where = this.whereBuild(model, this.query.where?.[sourceName]);
    const whereClause = [`MATCH (${columnList}) AGAINST (':0')`];
    if (where.sql) {
      whereClause.push(where.sql);
    }
    const query = `SELECT ${selectors}, '${sourceName}' as source, MATCH (${columnList}) AGAINST (':0') AS rank from ${tableName} where ${whereClause.join(
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

  getModelName(model: typeof Model) {
    const mappedName = this.modelNameMap.get(model.name);
    return (
      mappedName ??
      model.definition?.settings?.mysql?.table ??
      model.modelName ??
      model.name.toLowerCase()
    );
  }
}
