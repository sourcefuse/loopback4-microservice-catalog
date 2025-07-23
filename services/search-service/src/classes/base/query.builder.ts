// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  AnyObject,
  DataObject,
  PropertyDefinition,
  PropertyType,
} from '@loopback/repository';
import {HttpErrors, Model} from '@loopback/rest';
import {IGNORED_COLUMN, ModelProperties} from '../..';
import {Errors, TWO} from '../../const';
import {SearchQuery, SearchResult} from '../../models';
import {
  ColumnMap,
  PredicateComparison,
  PredicateValueType,
  Queries,
  Query,
  SearchWhereFilter,
  SearchableModel,
  ShortHandEqualType,
  isSearchableModel,
} from '../../types';
import {QueryList} from '../query-list';

export abstract class SearchQueryBuilder<T extends Model> {
  protected baseQueryList: Query[];
  protected limitQuery: string;
  protected orderQuery: string;
  protected query: DataObject<SearchQuery>;
  protected schema?: string;
  protected idType?: string = 'uuid';
  protected _placeholderIndex = 0;
  protected modelNameMap = new Map<string, string>();
  protected get placeholder(): string {
    this._placeholderIndex += 1;
    return this.paramString(this._placeholderIndex);
  }
  protected set placeholder(val: string | number) {
    if (typeof val === 'number') {
      this._placeholderIndex = val;
    }
  }
  constructor(query: DataObject<SearchQuery>, schema?: string) {
    this.query = query;
    this.schema = schema;
  }
  abstract search(
    model: typeof Model,
    columns: Array<keyof T> | ColumnMap<T>,
    ignoredColumns: (keyof T)[],
  ): void;

  abstract unionString: string;

  build(
    models: (SearchableModel<T> | typeof Model)[],
    ignoredColumns?: ModelProperties<T>[],
    type?: typeof Model,
    idType?: string,
  ) {
    this.idType = idType ?? 'uuid';
    if (!this.query.match) {
      throw new HttpErrors.BadRequest(Errors.MISSING_MATCH);
    }
    if (!(models && models.length > 0)) {
      throw new HttpErrors.BadRequest(Errors.NO_COLUMNS_TO_MATCH);
    }
    return {
      query: this.queryBuild(models, ignoredColumns, type),
      params: this.paramsBuild(this.query.match),
    };
  }

  limit() {
    const {limit, limitByType, offset} = this.query;

    if (!limit) {
      if (limitByType) {
        throw new HttpErrors.BadRequest(Errors.TYPE_WITHOUT_LIMIT);
      }
      if (offset) {
        throw new HttpErrors.BadRequest(Errors.OFFSET_WITHOUT_LIMIT);
      }
      return;
    }

    if (limitByType) {
      if (offset) {
        throw new HttpErrors.BadRequest(Errors.OFFSET_WITH_TYPE);
      }
      this.baseQueryList = this.baseQueryList.map(q => ({
        sql: `${q.sql} LIMIT ${limit}`,
        params: q.params,
      }));
      return;
    }

    this.limitQuery = `LIMIT ${limit} OFFSET ${offset ?? 0}`;
  }

  order(columns: Array<keyof T>) {
    let orderQuery: string;
    if (this.query.order) {
      const [column, sortOrder] = this.query.order.split(' ') as [
        keyof T,
        'ASC' | 'DESC',
      ];
      if (
        !columns.includes(column) ||
        !(sortOrder === 'DESC' || sortOrder === 'ASC')
      ) {
        throw new HttpErrors.BadRequest(Errors.INVALID_ORDER);
      }
      orderQuery = `ORDER BY ${String(column)} ${sortOrder}`;
    } else {
      orderQuery = 'ORDER BY rank DESC';
    }
    if (this.query.limitByType) {
      this.baseQueryList = this.baseQueryList.map(q => ({
        sql: `${q.sql} ${orderQuery}`,
        params: q.params,
      }));
    }
    if (this.baseQueryList.length === 1 && this.query.limitByType) {
      this.orderQuery = '';
    } else {
      this.orderQuery = orderQuery;
    }
  }

  getColumnListFromArrayOrMap(
    model: typeof Model,
    columns: Array<keyof T> | ColumnMap<T>,
    filter: (keyof T)[],
  ) {
    if (Array.isArray(columns)) {
      return this.getColumnListFromArray(model, columns, filter);
    } else {
      return this.getColumnListFromMap(model, columns, filter);
    }
  }

  getColumnListFromMap(
    model: typeof Model,
    columns: ColumnMap<T>,
    filter: (keyof T)[],
  ) {
    const columnList = Object.keys(columns)
      .filter(
        column =>
          columns[column as keyof ColumnMap<T>] !== IGNORED_COLUMN &&
          !filter.includes(column as keyof T),
      )
      .map(column =>
        this.getColumnName(
          model,
          columns[column as keyof ColumnMap<T>] as keyof T,
        ),
      )
      .join(', ');
    const selectors = Object.keys(columns)
      .map(column => {
        const columnNameInMap = (columns as AnyObject)[column];
        if (columnNameInMap === IGNORED_COLUMN) {
          return `null as ${column}`;
        } else {
          const dbName = this.getColumnName(model, columnNameInMap);
          return this._formatColumnSameInDb(column as keyof T, dbName);
        }
      })
      .join(', ');
    return {
      columnList,
      selectors,
    };
  }

  getColumnListFromArray(
    model: typeof Model,
    columns: Array<keyof T>,
    filter: (keyof T)[],
  ) {
    const columnList = columns
      .filter(column => !filter.includes(column))
      .map(column => this.getColumnName(model, column))
      .join(', ');
    const selectors = columns
      .map(column => {
        const nameInDb = this.getColumnName(model, column);
        return this._formatColumnSameInDb(column, nameInDb);
      })
      .join(', ');
    return {
      columnList,
      selectors,
    };
  }

  paramsBuild(param: string): AnyObject | Array<AnyObject | string> {
    const params = this.baseQueryList.reduce(
      (t: ShortHandEqualType[], v) => [...t, ...v.params],
      [],
    );
    return [param, ...params];
  }

  paramString(index: number) {
    return `:${index}`;
  }

  queryBuild(
    models: (SearchableModel<T> | typeof Model)[],
    ignoredColumns?: (keyof T)[],
    type?: typeof Model,
  ) {
    this.baseQueryList = [];
    this.limitQuery = '';
    this.orderQuery = '';
    type ??= SearchResult;
    const skipped = ignoredColumns ?? [];
    const defaultColumns = Object.keys(
      type.definition.properties,
    ) as ModelProperties<T>[];
    models.forEach(model => {
      if (isSearchableModel(model)) {
        const mapWithDefaults = defaultColumns.reduce((combined, column) => {
          if (!combined[column]) {
            combined[column] = column as string;
          }
          return combined;
        }, model.columns);
        if (model.identifier) {
          this.modelNameMap.set(model.model.name, model.identifier);
        }
        this.search(model.model, mapWithDefaults, skipped);
      } else {
        this.search(model, defaultColumns, skipped);
      }
    });
    this.order(defaultColumns);
    this.limit();
    const mainQuery = this.baseQueryList
      .filter(q => q.sql)
      .map(q => `(${q.sql})`)
      .join(this.unionString);

    return [mainQuery, this.orderQuery, this.limitQuery]
      .filter(q => q?.length > 0)
      .join(' ');
  }

  whereBuild<S extends typeof Model>(model: S, where?: SearchWhereFilter) {
    const queries = new QueryList();
    if (!where) {
      return {sql: '', params: []};
    }
    const keys = Object.keys(where) as (keyof SearchWhereFilter<T>)[];
    for (const key of keys) {
      const stmts = this.handleKeys(model, key, where);
      queries.add(stmts);
    }

    return queries.merge();
  }

  handleKeys(
    model: typeof Model,
    key: keyof SearchWhereFilter<T>,
    where: SearchWhereFilter,
  ): Query | Queries | undefined {
    const props = model.definition.properties;
    const stmts: Queries = [];
    if (key === 'and' || key === 'or') {
      return this.handleAndOr(where, key, model);
    }
    const p = props[key as string];
    if (!p) {
      throw new HttpErrors.BadRequest(`${Errors.UNKNOWN_PROPERTY}:${key}`);
    }

    const expression = where[key];
    const columnName = this.getColumnName(model, key);
    const stmt = this.buildStatement(expression, columnName, p, key, model);
    if (stmt) {
      stmts.push(stmt);
    }
    return stmts;
  }
  private buildStatement<K extends keyof SearchWhereFilter<T>>(
    expression: SearchWhereFilter<T>[K],
    columnName: string,
    propSchema: PropertyDefinition,
    key: K,
    model: typeof Model,
  ): Query | undefined {
    if (expression === null || expression === undefined) {
      return {sql: `${columnName} IS NULL`, params: []};
    }

    if (typeof expression === 'object') {
      return (
        this.handleObjectValue(expression, propSchema, key, model) ?? undefined
      );
    }

    const columnValue = this.toColumnValue(propSchema, expression);
    if (columnValue === null) {
      return {sql: `${columnName} IS NULL`, params: []};
    }

    return {
      sql: `${columnName}=${this.parseIdPlaceholder(propSchema)}`,
      params: [columnValue],
    };
  }

  handleAndOr<S extends typeof Model>(
    where: SearchWhereFilter,
    key: never,
    model: S,
  ): Query | undefined {
    const branches = [];
    let branchParams: ShortHandEqualType[] = [];
    const clauses = where[key] as Array<SearchWhereFilter<T>>;
    if (Array.isArray(clauses)) {
      for (let i = 0, n = clauses.length; i < n; i++) {
        const stmtForClause = this.whereBuild(model, clauses[i]);
        if (stmtForClause.sql) {
          stmtForClause.sql = `(${stmtForClause.sql})`;
          branchParams = branchParams.concat(stmtForClause.params);
          branches.push(stmtForClause.sql);
        }
      }
      const joinString = ` ${(key as string).toUpperCase()} `;
      if (branches.length > 0) {
        return {
          sql: `(${branches.join(joinString)})`,
          params: branchParams,
        };
      } else {
        return undefined;
      }
    } else {
      // do nothing
    }
  }

  handleObjectValue<S extends typeof Model>(
    expression: PredicateComparison<ShortHandEqualType>,
    p: PropertyDefinition,
    key: never,
    model: S,
  ): Query | undefined {
    const operator = Object.keys(
      expression,
    )[0] as keyof PredicateComparison<ShortHandEqualType>;
    const expressionValue = expression[
      operator
    ] as PredicateValueType<ShortHandEqualType>;
    const columnValue = this.buildColumnValueForExpression(expressionValue, p);
    if (['inq', 'nin', 'between'].includes(operator)) {
      if (operator === 'between' && columnValue.length !== TWO) {
        throw new HttpErrors.BadRequest(Errors.EXACTLY_TWO_VALUES_FOR_BETWEEN);
      } else if (columnValue.length === 0) {
        return;
      } else {
        //do nothing
      }
    }
    return this.buildExpression(key, p, operator, columnValue, model);
  }

  buildColumnValueForExpression(
    expressionValue: PredicateValueType<ShortHandEqualType>,
    p: PropertyDefinition,
  ) {
    const columnValue = [];
    if (Array.isArray(expressionValue)) {
      for (let j = 0, m = expressionValue.length; j < m; j++) {
        columnValue.push(this.toColumnValue(p, expressionValue[j]));
      }
    } else {
      columnValue.push(this.toColumnValue(p, expressionValue));
    }
    return columnValue;
  }

  parseIdPlaceholder(prop: PropertyDefinition) {
    if (prop.id && this.idType === 'uuid') {
      return `(${this.placeholder})::uuid`;
    } else {
      return this.placeholder;
    }
  }

  getColumnName(model: typeof Model, name: keyof T) {
    if (model.definition.properties[name as string]) {
      return model.definition.properties[name as string].name ?? name;
    }
    return undefined;
  }

  toColumnValue(
    prop: PropertyDefinition,
    val: PredicateValueType<ShortHandEqualType>,
  ) {
    const type = prop.type;
    if (type === String && typeof val === 'string') {
      return String(val);
    }
    if (type === Number && typeof val === 'number') {
      return val;
    }

    if (
      this.isDateType(type) &&
      (val instanceof Date || typeof val === 'string')
    ) {
      return this.toDateType(val);
    }

    // PostgreSQL support char(1) Y/N
    if (type === Boolean && typeof val === 'boolean') {
      return !!val;
    }

    if (Array.isArray(type)) {
      // There is two possible cases for the type of "val" as well as two cases for dataType
      return this.toArrayPropTypes(prop, val);
    }

    return val;
  }
  private isDateType(type: PropertyType): boolean {
    return (
      type === Date || (typeof type === 'function' && type.name === 'Timestamp')
    );
  }

  toDateType(val: Date | string) {
    if (!(val instanceof Date) || !val.toISOString) {
      val = new Date(val);
    }
    const iso = val.toISOString();

    // Pass in date as UTC and make sure Postgresql stores using UTC timezone
    return {
      sql: `${this.placeholder}::TIMESTAMP WITH TIME ZONE`,
      params: [iso],
    };
  }

  toArrayPropTypes<R>(prop: PropertyDefinition, val: R[] | R) {
    const isArrayDataType =
      prop.postgresql && prop.postgresql.dataType === 'varchar[]';
    if (Array.isArray(val)) {
      if (isArrayDataType) {
        return val;
      } else {
        return JSON.stringify(val);
      }
    } else if (isArrayDataType && typeof val === 'string') {
      return JSON.parse(val);
    } else {
      return val;
    }
  }

  buildExpression(
    columnName: keyof T,
    prop: PropertyDefinition,
    operator: string,
    value: (Query | ShortHandEqualType)[] | ShortHandEqualType | Query,
    model: typeof Model,
  ) {
    const getPlaceholder = () => this.parseIdPlaceholder(prop);

    let expression = this.getColumnName(model, columnName);
    let clause: Query;
    switch (operator) {
      case 'gt':
        expression += '>';
        clause = this.buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'gte':
        expression += '>=';
        clause = this.buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'lt':
        expression += '<';
        clause = this.buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'lte':
        expression += '<=';
        clause = this.buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'neq':
        if (value === null) {
          expression += ' IS NOT NULL';
        } else {
          expression += '!=';
        }
        clause = this.buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'between':
        expression += ' BETWEEN ';
        clause = this.buildClauseFromExpress(
          value,
          ' AND ',
          false,
          getPlaceholder,
        );
        break;
      case 'nin':
        expression += ' NOT IN ';
        clause = this.buildClauseFromExpress(value, ', ', true, getPlaceholder);
        break;
      case 'inq':
        expression += ' IN ';
        clause = this.buildClauseFromExpress(value, ', ', true, getPlaceholder);
        break;
      default:
        throw new HttpErrors.BadRequest(
          `${Errors.INVALID_WHERE_OPERATOR}:${operator}`,
        );
    }
    return {
      sql: `${expression}${clause.sql}`,
      params: clause.params,
    };
  }

  /**
   * The function `buildClauseFromExpress` constructs a SQL clause from an array of values, a separator,
   * and other parameters.
   * @param {(Query | ShortHandEqualType)[] | ShortHandEqualType | Query} values - The `values`
   * parameter in the `buildClauseFromExpress` function can be one of the following types:
   * @param {string} separator - The `separator` parameter is a string that will be used to separate the
   * values in the resulting clause.
   * @param {boolean} grouping - The `grouping` parameter in the `buildClauseFromExpress` function is a
   * boolean flag that determines whether the generated SQL clause should be wrapped in parentheses for
   * grouping purposes. If `grouping` is set to `true`, the SQL clause will be enclosed in parentheses.
   * If `grouping`
   * @param getPlaceholder - The `buildClauseFromExpress` function takes in four parameters:
   * @returns The `buildClauseFromExpress` function returns an object with `sql` and `params`
   * properties. The `sql` property contains the generated SQL clause based on the input values,
   * separator, and grouping settings. The `params` property contains an array of parameters used in the
   * SQL clause.
   */
  buildClauseFromExpress(
    values: (Query | ShortHandEqualType)[] | ShortHandEqualType | Query,
    separator: string,
    grouping: boolean,
    getPlaceholder: () => string,
  ) {
    if (Array.isArray(values)) {
      const stmts: string[] = [];
      let params: ShortHandEqualType[] = [];
      for (const val of values) {
        if (this._isQuery(val)) {
          stmts.push(val.sql);
          params = [...params, ...val.params];
        } else {
          stmts.push(getPlaceholder());
          params.push(val);
        }
      }
      const sql = grouping
        ? `(${stmts.join(separator)})`
        : stmts.join(separator);
      return {
        sql,
        params,
      };
    }
    if (this._isQuery(values)) {
      return values;
    }
    return {
      sql: getPlaceholder(),
      params: [values],
    };
  }

  getTableName(model: typeof Model) {
    return model.modelName;
  }

  getSchemaName(model: typeof Model) {
    return this.schema ?? `public`;
  }

  getModelName(model: typeof Model) {
    const mapName = this.modelNameMap.get(model.name);
    return mapName ?? model.modelName ?? model.name;
  }

  private _isQuery(query: Query | ShortHandEqualType): query is Query {
    return !!(query && (query as Query).sql && (query as Query).params);
  }

  private _formatColumnSameInDb(modelColumn: keyof T, dbColumn: string) {
    if (modelColumn !== dbColumn) {
      return `${dbColumn} as ${String(modelColumn)}`;
    } else {
      return modelColumn;
    }
  }
}
