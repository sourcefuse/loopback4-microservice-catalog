// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  AnyObject,
  DataObject,
  Model,
  ShortHandEqualType,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Errors} from '../../const';
import {SearchQuery} from '../../models';
import {ColumnMap} from '../../types';
import {SearchQueryBuilder} from '../base';

export class PsqlQueryBuilder<T extends Model> extends SearchQueryBuilder<T> {
  unionString = ' UNION ALL ';
  schema: string;
  _placeholderIndex = 1;

  constructor(query: DataObject<SearchQuery>, schema?: string) {
    super(query, schema);
  }

  search(
    model: typeof Model,
    columns: Array<keyof T> | ColumnMap<T>,
    ignoreColumns: (keyof T)[],
  ) {
    const tableName = this.getTableName(model);
    const sourceName = this.getModelName(model);
    const schemaName = this.getSchemaName(model);
    const {columnList, selectors} = this.getColumnListFromArrayOrMap(
      model,
      columns,
      ignoreColumns,
    );

    if (!columnList) {
      throw new HttpErrors.BadRequest(Errors.NO_COLUMNS_TO_MATCH);
    }

    const where = this.whereBuild(model, this.query.where?.[sourceName]);
    const whereClause = [
      `to_tsvector(${schemaName}.f_concat_ws(' ', ${columnList})) @@ to_tsquery($1)`,
    ];
    if (where.sql) {
      whereClause.push(where.sql);
    }

    let query = `SELECT ${selectors}, '${sourceName}' as source, ts_rank_cd(to_tsvector(${schemaName}.f_concat_ws(' ', ${columnList})), to_tsquery($1)) as rank 
    from ${schemaName}.${tableName} where ${whereClause.join(' AND ')}`;
    query = query.replace('\n', '');

    this.baseQueryList.push({
      sql: query,
      params: where.params,
    });
  }

  paramString(index: number) {
    return `$${index}`;
  }

  paramsBuild(param: string): AnyObject | Array<AnyObject | string> {
    const params = this.baseQueryList.reduce(
      (t: ShortHandEqualType[], v) => [...t, ...v.params],
      [],
    );
    return [this._formatAndSanitize(param), ...params];
  }

  getModelName(model: typeof Model) {
    const mappedName = this.modelNameMap.get(model.name);
    return (
      mappedName ??
      model.definition?.settings?.postgresql?.table ??
      model.modelName ??
      model.name.toLowerCase()
    );
  }

  getSchemaName(model: typeof Model) {
    return (
      this.schema ?? model.definition?.settings?.postgresql?.schema ?? `public`
    );
  }

  _formatAndSanitize(param: string) {
    return param
      .replace(/[^A-Za-z\s0-9]/g, ' ')
      .split(' ')
      .filter(p => p)
      .map(p => `${p}:*`)
      .join('<->');
  }
}
