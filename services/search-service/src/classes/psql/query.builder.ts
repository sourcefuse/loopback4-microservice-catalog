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
    const modelName = model.modelName;
    const {columnList, selectors} = this.getColumnListFromArrayOrMap(
      model,
      columns,
      ignoreColumns,
    );

    if (!columnList) {
      throw new HttpErrors.BadRequest(Errors.NO_COLUMNS_TO_MATCH);
    }

    const where = this.whereBuild(model, this.query.where?.[modelName]);
    const whereClause = [
      `to_tsvector(${
        this.schema || 'public'
      }.f_concat_ws(' ', ${columnList})) @@ to_tsquery($1)`,
    ];
    if (where.sql) {
      whereClause.push(where.sql);
    }

    const query = `SELECT ${selectors}, '${modelName}' as source, ts_rank_cd(to_tsvector(${
      this.schema || 'public'
    }.f_concat_ws(' ', ${columnList})), to_tsquery($1)) as rank from ${
      this.schema || 'public'
    }.${modelName} where ${whereClause.join(' AND ')}`;

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

  _formatAndSanitize(param: string) {
    return param
      .replace(/[^A-Za-z\s0-9]/g, ' ')
      .split(' ')
      .filter(p => p)
      .map(p => `${p}:*`)
      .join('<->');
  }
}
