import {AnyObject} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';

import {
  StructuredQueryInterface,
  WhereClause,
  WhereCondition,
} from '../interfaces/structured-query.interface';
import {QueryUtilityInterface} from '../interfaces/query-utility.interface';
import {inject} from '@loopback/core';
export class SequelizeQueryUtility implements QueryUtilityInterface {
  constructor(@inject(LOGGER.LOGGER_INJECT) private logger: ILogger) {}
  /**
   * The `formatCondition` function formats a given condition or clause into a string representation.
   * @param {WhereCondition | WhereClause} condition - The `condition` parameter can be either a
   * `WhereCondition` object or a `WhereClause` object.
   * @returns a string representation of the given condition. If the condition is a simple
   * WhereCondition object, it returns a string in the format "field operator value". If the condition
   * is a complex WhereClause object with nested conditions, it returns a string in the format
   * "(nestedConditions)". If the condition is malformed or not recognized, it returns an empty string.
   */
  private formatCondition(condition: WhereCondition | WhereClause): string {
    if (this.isWhereCondition(condition)) {
      return this.formatSimpleCondition(condition);
    } else if (this.isWhereClause(condition)) {
      return this.formatComplexCondition(condition);
    } else {
      // Fallback for malformed conditions
      return '';
    }
  }
  private formatComplexCondition(condition: WhereClause) {
    const nestedConditions: string[] = [];
    if (condition.and) {
      nestedConditions.push(
        condition.and
          .map(subCondition => this.formatCondition(subCondition))
          .join(' AND '),
      );
    }
    if (condition.or) {
      nestedConditions.push(
        condition.or
          .map(subCondition => this.formatCondition(subCondition))
          .join(' OR '),
      );
    }
    return `(${nestedConditions.join(' AND ')})`;
  }
  private formatSimpleCondition(condition: WhereCondition) {
    const value =
      typeof condition.value === 'string'
        ? `'${condition.value.replace(/'/g, "''")}'`
        : condition.value;
    return `${condition.field} ${condition.operator} ${value}`;
  }
  private isWhereCondition(
    condition: WhereCondition | WhereClause,
  ): condition is WhereCondition {
    return (
      'field' in condition && 'operator' in condition && 'value' in condition
    );
  }
  private isWhereClause(
    clause: WhereCondition | WhereClause,
  ): clause is WhereClause {
    return 'and' in clause || 'or' in clause;
  }

  /**
   * The `jsonToQueryConverter` function takes a structured query in JSON format and converts it into a
   * SQL query string along with any bind parameters.
   * @param {StructuredQueryInterface} sqlQuery - The `sqlQuery` parameter is an object that represents
   * a structured SQL query. It has the following properties:
   * @returns The function `jsonToSqlConverter` returns an object with two properties: `query` and
   * `bind`. The `query` property is a string representing the SQL query generated from the input
   * `sqlQuery`. The `bind` property is an object containing any bind parameters used in the SQL query.
   */
  public jsonToQueryConverter(sqlQuery: StructuredQueryInterface): {
    query: string;
    bind: AnyObject;
  } {
    let query = 'SELECT ';
    const bind: AnyObject = {};
    const valueIndex = 1;
    query += this.handleSelectClause(sqlQuery.select);
    query += this.handleFromClause(sqlQuery.from);
    query += this.handleWhereClause(sqlQuery, bind, valueIndex);

    // Handle ORDER BY clause
    if (sqlQuery.orderBy) {
      const orderByStrings = sqlQuery.orderBy.map(
        order => `${order.field} ${order.order.toUpperCase()}`,
      );
      query += orderByStrings.length
        ? ' ORDER BY ' + orderByStrings.join(', ')
        : '';
    }

    // Handle LIMIT and OFFSET
    if (sqlQuery.limit !== undefined) {
      query += ` LIMIT ${sqlQuery.limit}`;
    }
    if (sqlQuery.offset !== undefined) {
      query += ` OFFSET ${sqlQuery.offset}`;
    }

    return {query, bind};
  }
  private handleWhereClause(
    sqlQuery: StructuredQueryInterface,
    bind: AnyObject,
    valueIndex: number,
  ) {
    let query = '';
    if (!sqlQuery.where) {
      return query;
    }

    const [whereConditions] = this.processWhereClause(
      sqlQuery.where,
      bind,
      valueIndex,
    );

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }
    return query;
  }
  private handleFromClause(from: StructuredQueryInterface['from']) {
    let query = '';
    // Handle FROM clause
    query += ' FROM ' + from.dataSources.join(', ');

    // Handle JOIN clauses
    from.joins?.forEach(join => {
      query += ` ${join.type.toUpperCase()} JOIN ${join.dataSource} ON ${
        join.on
      }`;
    });
    return query;
  }
  private handleSelectClause(select: StructuredQueryInterface['select']) {
    let query = '';
    if (!select) {
      return '*';
    }
    if (select.distinct) {
      query += 'DISTINCT ';
    }
    const fieldStrings = select.fields.map(field => {
      if (typeof field === 'string') {
        return field;
      } else {
        return `${field.field} AS ${field.alias}`;
      }
    });
    query += fieldStrings.join(', ');

    if (select.functions && select.functions.length > 0) {
      const functionStrings = select.functions.map(func => {
        let funcString = `${func.functionType}(${func.field})`;
        if (func.alias) {
          funcString += ' AS ' + func.alias;
        }
        return funcString;
      });

      if (query !== '') {
        query += ', ';
      }
      query += functionStrings.join(', ');
    }
    return query;
  }

  /**
   * The function processes a where clause object and generates an array of SQL conditions and a value
   * index for parameter binding.
   * @param {WhereClause} whereClause - The `whereClause` parameter is an object that represents the
   * conditions for the WHERE clause in a SQL query. It can have the following structure:
   * @param {AnyObject} bind - The `bind` parameter is an object that will be used to store the values
   * of the parameters in the SQL query. It is of type `AnyObject`, which means it can be any type of
   * object.
   * @param {number} valueIndex - The `valueIndex` parameter is used to keep track of the index of the
   * bind parameters. It is incremented each time a new bind parameter is added to the `bind` object.
   * @returns The function `processWhereClause` returns an array containing two elements:
   */
  private processWhereClause(
    whereClause: WhereClause,
    bind: AnyObject,
    valueIndex: number,
  ): [string[], number] {
    const whereConditions: string[] = [];

    for (const [key, value] of Object.entries(whereClause)) {
      // Skip undefined values
      if (value === undefined) continue;

      // Process 'and' or 'or' complex conditions
      if (key === 'and' || key === 'or') {
        const [conditionString, newIndex] = this.processAndOrCondition(
          key,
          value,
          bind,
          valueIndex,
        );
        if (conditionString) {
          whereConditions.push(conditionString);
          valueIndex = newIndex;
        }
        continue;
      }

      // Handle simple conditions
      const [conditionString, newIndex] = this.processSimpleConditionWrapper(
        key,
        value,
        bind,
        valueIndex,
      );
      if (conditionString) {
        whereConditions.push(conditionString);
        valueIndex = newIndex;
      }
    }

    return [whereConditions, valueIndex];
  }

  private processAndOrCondition(
    key: string,
    value: AnyObject,
    bind: AnyObject,
    valueIndex: number,
  ): [string, number] {
    if (!Array.isArray(value)) {
      this.logger.error(
        `Invalid WhereClause structure: ${key} must be an array.`,
      );
      return ['', valueIndex];
    }

    return this.processComplexCondition(
      value,
      key.toUpperCase(),
      bind,
      valueIndex,
    );
  }

  private processSimpleConditionWrapper(
    key: string,
    value: AnyObject,
    bind: AnyObject,
    valueIndex: number,
  ): [string, number] {
    if (!this.isWhereCondition(value)) {
      this.logger.error(
        `Invalid WhereClause structure: ${key} is not a valid WhereCondition.`,
      );
      return ['', valueIndex];
    }

    const conditionString = this.processSimpleCondition(
      value,
      bind,
      valueIndex,
    );
    return [conditionString, valueIndex + 1];
  }

  private processComplexCondition(
    conditions: (WhereCondition | WhereClause)[],
    operator: string,
    bind: AnyObject,
    valueIndex: number,
  ): [string, number] {
    const nestedConditions: string[] = [];
    for (const condition of conditions) {
      let conditionString: string;
      if (this.isWhereCondition(condition)) {
        conditionString = this.processSimpleCondition(
          condition,
          bind,
          valueIndex,
        );
        valueIndex++;
      } else {
        const nestedResult = this.processWhereClause(
          condition,
          bind,
          valueIndex,
        );
        conditionString = `(${nestedResult[0].join(' ' + operator + ' ')})`;
        valueIndex = nestedResult[1];
      }
      nestedConditions.push(conditionString);
    }
    return [
      nestedConditions.length > 0
        ? `(${nestedConditions.join(' ' + operator + ' ')})`
        : '',
      valueIndex,
    ];
  }
  private processSimpleCondition(
    condition: WhereCondition,
    bind: AnyObject,
    valueIndex: number,
  ): string {
    const bindKey = `param${valueIndex}`;
    bind[bindKey] = condition.value;
    return `${condition.field} ${condition.operator} $${bindKey}`;
  }
  /**
   * The function validates a JSON query by checking if it contains the required properties and if the
   * selected fields are allowed based on the available data sources.
   * @param {StructuredQueryInterface} query - The `query` parameter is an object that represents a SQL
   * query. It has the following structure:
   * @returns a boolean value.
   */
  public validateQueryObject(query: StructuredQueryInterface): boolean {
    if (!query.select || !query.from?.dataSources || !query.select.fields) {
      return false;
    }
    const allDataSources = this.listAllDataSourcesFromJson(query);
    const includedFields = this.extractFields(query.select.fields);

    const fieldsAllowed = this.areFieldsAllowed(includedFields, allDataSources);

    return fieldsAllowed;
  }

  /**
   * The function `listAllDataSourcesFromJson` takes a SQL query object and returns an array of all the
   * data sources mentioned in the query, optionally removing the schema from the data source names.
   * @param {StructuredQueryInterface} query - The `sqlQuery` parameter is an object that represents a SQL
   * query. It contains information about the data sources used in the query.
   * @param {boolean} [removeSchema=false] - The `removeSchema` parameter is a boolean flag that
   * determines whether the schema should be removed from the data source names. If `removeSchema` is set
   * to `true`, the schema will be removed from the data source names. If `removeSchema` is set to
   * `false` or not provided
   * @returns an array of strings, which represents all the data sources extracted from the given
   * `sqlQuery` object.
   */
  public listAllDataSourcesFromJson(
    query: StructuredQueryInterface,
    removeSchema = false,
  ): string[] {
    let allDataSources = query.from.dataSources;

    if (removeSchema) {
      allDataSources = allDataSources.map(ds => ds.split('.')[1]);
    }

    if (query.from.joins) {
      query.from.joins.forEach(join => {
        if (join.dataSource) {
          let ds = join.dataSource;
          if (removeSchema) {
            ds = ds.split('.')[1];
          }
          allDataSources.push(ds);
        }
      });
    }

    return allDataSources;
  }

  /**
   * The function checks if all fields in a given array are allowed based on a list of allowed data
   * sources.
   * @param {string[]} fields - An array of strings representing the fields that need to be checked for
   * permission.
   * @param {string[]} dataSources - The `dataSources` parameter is an array of strings that represents
   * the available data sources.
   * @returns a boolean value.
   */
  private areFieldsAllowed(fields: string[], dataSources: string[]): boolean {
    return fields.every(field => this.isFieldAllowed(field, dataSources));
  }

  /**
   * The function checks if a given field is allowed based on a list of data sources.
   * @param {string} field - A string representing the field that needs to be checked.
   * @param {string[]} dataSources - An array of strings representing the data sources.
   * @returns a boolean value.
   */
  private isFieldAllowed(field: string, dataSources: string[]): boolean {
    return dataSources.some(dataSource => field.startsWith(dataSource + '.'));
  }
  /**
   * The function "extractFields" takes an array of strings or objects with a "field" property and
   * returns an array of strings containing the "field" values.
   * @param {(string | {field: string; alias: string})[]} fields - An array of strings or objects. Each
   * element in the array can be either a string or an object with a "field" property and an optional
   * "alias" property.
   * @returns an array of strings.
   */
  private extractFields(
    fields: (string | {field: string; alias: string})[],
  ): string[] {
    return fields.map(field =>
      typeof field === 'string' ? field : field.field,
    );
  }
}
