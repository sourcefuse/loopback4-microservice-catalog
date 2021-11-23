import {Provider} from '@loopback/context';
import {PredicateComparison, ShortHandEqualType, Where} from '@loopback/filter';
import {Entity, PropertyDefinition, Type} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AnyObject} from 'loopback-datasource-juggler';
import {ModelConstructor} from '../..';
import {Errors} from './errors';
import {
  PredicateValueType,
  Queries,
  Query,
  QueryList,
  WhereBuilderFunction,
} from './types';
const TWO = 2;
export class WhereFunctionProvider implements Provider<WhereBuilderFunction> {
  protected _placeholderIndex = 0;
  private paramBuilder = (index: number) => {
    return `$${index}`;
  };
  private idType = 'uuid';
  protected get placeholder(): string {
    this._placeholderIndex += 1;
    return this.paramBuilder(this._placeholderIndex);
  }
  protected set placeholder(val: string) {
    if (typeof val === 'number') {
      this._placeholderIndex = val;
    }
  }
  value() {
    return <T extends Entity>(
      prefix: string,
      model: ModelConstructor<T>,
      where?: Where<T>,
      idType?: string,
      paramBuilder?: (index: number) => string,
    ) => {
      if (paramBuilder) {
        this.paramBuilder = paramBuilder;
      }
      if (idType) {
        this.idType = idType;
      }
      return this.where(prefix, model, where);
    };
  }

  where<T extends Entity>(
    prefix: string,
    model: ModelConstructor<T>,
    where?: Where<T>,
  ) {
    const queries = new QueryList();
    if (!where) {
      return {sql: '', params: []};
    }
    const keys = Object.keys(where) as (keyof Where<T>)[];
    for (const key of keys) {
      const stmts = this.handleOperator(prefix, model, key, where);
      queries.add(stmts);
    }
    return queries.merge();
  }

  handleOperator<T extends Entity>(
    prefix: string,
    model: ModelConstructor<T>,
    key: keyof Where<T>,
    where: Where<T>,
  ) {
    const props = model.definition.properties;
    const stmts: Queries = [];
    let columnValue;
    if (key === 'and' || key === 'or') {
      return this.handleAndOr(prefix, model, key, where);
    }
    const p = props[key as string];
    if (!p) {
      throw new HttpErrors.BadRequest(`${Errors.UNKNOWN_PROPERTY}:${key}`);
    }

    const expression = where[key] as
      | PredicateComparison<typeof key>
      | (typeof key & ShortHandEqualType);
    const columnName = this._getColumnName(model, key);
    if (expression === null || expression === undefined) {
      stmts.push({sql: `${prefix}.${columnName} IS NULL`, params: []});
    } else if (typeof expression === 'object') {
      const mergedStmt = this.handleObjectValue(expression, p, key, model);
      if (mergedStmt) {
        stmts.push(mergedStmt);
      } else {
        return;
      }
    } else {
      columnValue = this._toColumnValue(p, expression);
      if (columnValue === null) {
        stmts.push({sql: `${prefix}.${columnName} IS NULL`, params: []});
      } else {
        stmts.push({
          sql: `${prefix}.${columnName}=${this.parseIdPlaceholder(p)}`,
          params: [columnValue],
        });
      }
    }
    return stmts;
  }

  handleAndOr<T extends Entity>(
    prefix: string,
    model: ModelConstructor<T>,
    key: string,
    where: Where<T>,
  ) {
    const branches = [];
    let branchParams: ShortHandEqualType[] = [];
    const clauses = (where as AnyObject)[key] as Array<Where<T>>;
    if (Array.isArray(clauses)) {
      for (let i = 0, n = clauses.length; i < n; i++) {
        const stmtForClause = this.where(prefix, model, clauses[i]);
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

  handleObjectValue<T extends Entity>(
    expression: PredicateComparison<ShortHandEqualType>,
    p: PropertyDefinition,
    key: never,
    model: ModelConstructor<T>,
  ): Query | undefined {
    const operator = Object.keys(
      expression,
    )[0] as keyof PredicateComparison<ShortHandEqualType>;
    const expressionValue = expression[
      operator
    ] as PredicateValueType<ShortHandEqualType>;
    const columnValue = this._buildColumnValueForExpression(expressionValue, p);
    if (['inq', 'nin', 'between'].includes(operator)) {
      if (operator === 'between' && columnValue.length !== TWO) {
        throw new HttpErrors.BadRequest(Errors.EXACTLY_TWO_VALUES_FOR_BETWEEN);
      } else {
        if (columnValue.length === 0) {
          return;
        }
      }
    }
    return this._buildExpression(key, p, operator, columnValue, model);
  }

  _buildColumnValueForExpression(
    expressionValue: PredicateValueType<ShortHandEqualType>,
    p: PropertyDefinition,
  ) {
    const columnValue = [];
    if (Array.isArray(expressionValue)) {
      for (let j = 0, m = expressionValue.length; j < m; j++) {
        columnValue.push(this._toColumnValue(p, expressionValue[j]));
      }
    } else {
      columnValue.push(this._toColumnValue(p, expressionValue));
    }
    return columnValue;
  }

  _buildExpression<T extends Entity>(
    columnName: keyof T,
    prop: PropertyDefinition,
    operator: string,
    value: (Query | ShortHandEqualType)[] | ShortHandEqualType | Query,
    model: ModelConstructor<T>,
  ) {
    const getPlaceholder = () => this.parseIdPlaceholder(prop);

    let expression = this._getColumnName(model, columnName);
    let clause: Query;
    switch (operator) {
      case 'gt':
        expression += '>';
        clause = this._buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'gte':
        expression += '>=';
        clause = this._buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'lt':
        expression += '<';
        clause = this._buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'lte':
        expression += '<=';
        clause = this._buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'neq':
        if (value === null) {
          expression += ' IS NOT NULL';
        } else {
          expression += '!=';
        }
        clause = this._buildClauseFromExpress(value, '', false, getPlaceholder);
        break;
      case 'between':
        expression += ' BETWEEN ';
        clause = this._buildClauseFromExpress(
          value,
          ' AND ',
          false,
          getPlaceholder,
        );
        break;
      case 'nin':
        expression += ' NOT IN ';
        clause = this._buildClauseFromExpress(
          value,
          ', ',
          true,
          getPlaceholder,
        );
        break;
      case 'inq':
        expression += ' IN ';
        clause = this._buildClauseFromExpress(
          value,
          ', ',
          true,
          getPlaceholder,
        );
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

  _getColumnName<T extends Entity>(model: ModelConstructor<T>, name: keyof T) {
    if (model.definition.properties[name as string]) {
      return model.definition.properties[name as string].name || name;
    }
    return undefined;
  }

  parseIdPlaceholder(prop: PropertyDefinition) {
    if (prop.id && this.idType === 'uuid') {
      return `(${this.placeholder})::uuid`;
    } else {
      return this.placeholder;
    }
  }

  _buildClauseFromExpress(
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
      let sql = stmts.join(separator);
      if (grouping) {
        sql = `(${sql})`;
      }
      return {
        sql,
        params,
      };
    } else {
      if (this._isQuery(values)) {
        return values;
      } else {
        return {
          sql: getPlaceholder(),
          params: [values],
        };
      }
    }
  }

  _toColumnValue(
    prop: PropertyDefinition,
    val: PredicateValueType<ShortHandEqualType>,
  ) {
    if (prop.type === String && typeof val === 'string') {
      return String(val);
    }
    if (prop.type === Number && typeof val === 'number') {
      if (isNaN(val)) {
        // Map NaN to NULL
        return val;
      }
      return val;
    }

    if (
      (prop.type === Date ||
        (prop.type as Type<string>).name === 'Timestamp') &&
      (val instanceof Date || typeof val === 'string')
    ) {
      return this._toDateType(val);
    }

    // PostgreSQL support char(1) Y/N
    if (prop.type === Boolean && typeof val === 'boolean') {
      return !!val;
    }

    if (Array.isArray(prop.type)) {
      // There is two possible cases for the type of "val" as well as two cases for dataType
      return this._toArrayPropTypes(prop, val);
    }

    return val;
  }

  _toDateType(val: Date | string) {
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

  _toArrayPropTypes<R>(prop: PropertyDefinition, val: R[] | R) {
    const isArrayDataType =
      prop.postgresql && prop.postgresql.dataType === 'varchar[]';
    if (Array.isArray(val)) {
      if (isArrayDataType) {
        return val;
      } else {
        return JSON.stringify(val);
      }
    } else {
      if (isArrayDataType && typeof val === 'string') {
        return JSON.parse(val);
      } else {
        return val;
      }
    }
  }

  private _isQuery(query: Query | ShortHandEqualType): query is Query {
    return !!(query && (query as Query).sql && (query as Query).params);
  }
}
