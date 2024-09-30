import {Application, CoreBindings, inject} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {CustomFilter, QueryBinding} from '../interfaces';
import {QueryUtilityInterface} from '../interfaces/query-utility.interface';
import {
  AliasExpression,
  DataSource,
  FieldExpression,
  FunctionExpression,
  JoinClause,
  SelectClause,
  StructuredQueryInterface,
  SubQueryWithAlias,
  WhereClause,
  WhereCondition,
} from '../interfaces/structured-query.interface';
import {ReportingServiceComponentBindings} from '../keys';
/* The `SequelizeQueryUtility` class in TypeScript provides methods for preparing and generating SQL
queries based on structured query objects. */
export class SequelizeQueryUtility implements QueryUtilityInterface {
  constructor(
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly app: Application,
  ) {}

  /**
   * The function prepares a final SQL query by adding WHERE conditions, ORDER BY, LIMIT, and OFFSET
   * clauses based on the provided filter.
   * @param {string} sqlQuery - The `sqlQuery` parameter is a string representing the initial SQL query
   * that you want to modify based on the provided filter conditions.
   * @param filter - The `filter` parameter is an object that contains filter conditions to be applied
   * to the SQL query. It has a property `where` which represents the WHERE condition to be applied in
   * the SQL query.
   * @returns The function `prepareFinalSqlQuery` returns a string representing the final SQL query
   * after processing the provided SQL query and filter conditions.
   */
  public prepareFinalSqlQuery(
    sqlQuery: string,
    filter: CustomFilter<AnyObject>,
  ): string {
    let finalQuery = sqlQuery;

    // Process WHERE conditions if any
    if (filter.where) {
      const whereSQL = this.formatCondition(filter.where);
      if (!finalQuery.toUpperCase().includes('WHERE')) {
        finalQuery += ` WHERE ${whereSQL}`;
      } else {
        finalQuery += ` AND (${whereSQL})`;
      }
    }

    // Append ORDER BY, LIMIT, and OFFSET clauses
    finalQuery = this.appendClauses(finalQuery, filter);

    return finalQuery;
  }

  /**
   * The function `convertOrderToOrderBy` converts an array of strings representing order criteria into
   * a structured query format.
   * @param {string[]} [orderArray] - The `orderArray` parameter is an optional array of strings that
   * represents the order in which to sort query results. Each string in the array consists of a field
   * name followed by a space and then the sorting order ('ASC' for ascending or 'DESC' for
   * descending).
   * @returns An array of objects with each object containing a field and order property, where the
   * order property is either 'ASC' or 'DESC'. If the input orderArray is not provided, an empty array
   * is returned.
   */
  private convertOrderToOrderBy(
    orderArray?: string[],
  ): StructuredQueryInterface['orderBy'] {
    if (!orderArray) {
      return [];
    }
    return orderArray.map(orderStr => {
      const [field, ord] = orderStr.split(' ');
      return {field, order: ord.toUpperCase() as 'ASC' | 'DESC'};
    });
  }

  /**
   * The function `appendClauses` modifies a SQL query by appending ORDER BY, LIMIT, and OFFSET clauses
   * based on the provided filter object.
   * @param {string} sqlQuery - The `sqlQuery` parameter is a string representing an SQL query to which
   * you want to append clauses based on the provided `filter` object. The function `appendClauses`
   * handles appending clauses like ORDER BY, LIMIT, and OFFSET to the SQL query based on the filter
   * criteria.
   * @param filter - The `filter` parameter in the `appendClauses` function is of type
   * `CustomFilter<AnyObject>`. This means that it is a custom filter object that can filter any type
   * of object. The function takes this filter object and appends clauses to an SQL query based on the
   * filter criteria provided
   * @returns The `appendClauses` function returns the updated SQL query string after appending any
   * ORDER BY, LIMIT, and OFFSET clauses based on the provided filter object.
   */
  private appendClauses(
    sqlQuery: string,
    filter: CustomFilter<AnyObject>,
  ): string {
    // Handle ORDER BY
    if (filter.order) {
      // Remove existing ORDER BY clause if present and trim the query to remove trailing spaces
      sqlQuery = sqlQuery.replace(/ORDER BY .*/i, '').trim();

      const orderByParts =
        this.convertOrderToOrderBy(filter.order)?.map(
          order =>
            `${typeof order.field === 'object' ? JSON.stringify(order.field) : order.field} ${order.order}`,
        ) ?? [];

      // Only proceed to append ORDER BY SQL if there are orderByParts
      if (orderByParts.length > 0) {
        const orderBySQL = `ORDER BY ${orderByParts.join(', ')}`;
        sqlQuery += ` ${orderBySQL}`;
      }
    }

    // Handle LIMIT and OFFSET
    if (filter.limit !== undefined || filter.offset !== undefined) {
      // Remove existing LIMIT and OFFSET clauses if present and trim the query
      sqlQuery = sqlQuery
        .replace(/LIMIT \d+/i, '')
        .replace(/OFFSET \d+/i, '')
        .trim();

      if (filter.limit !== undefined) {
        sqlQuery += ` LIMIT ${filter.limit}`;
      }

      if (filter.offset !== undefined) {
        sqlQuery += ` OFFSET ${filter.offset}`;
      }
    }

    return sqlQuery;
  }

  /**
   * The `formatCondition` function in TypeScript formats either a simple or complex SQL WHERE
   * condition based on the input provided.
   * @param {WhereCondition | WhereClause} condition - The `condition` parameter in the
   * `formatCondition` method can be either a `WhereCondition` or a `WhereClause`. It is used to
   * determine whether to format a simple condition or a complex condition based on the type of the
   * input.
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter is an optional parameter
   * of type `QueryBinding`. It is used to manage the bindings for the query conditions. If provided,
   * it can be used to bind values to placeholders in the query conditions. If not provided, the method
   * will still work but may not be able to
   * @returns The `formatCondition` method returns a string value. The returned string is either the
   * result of formatting a simple condition using `formatSimpleCondition` method, formatting a complex
   * condition using `formatComplexCondition` method, or an empty string if the input condition is
   * neither a `WhereCondition` nor a `WhereClause`.
   */
  private formatCondition(
    condition: WhereCondition | WhereClause,
    bindingManager?: QueryBinding,
  ): string {
    if (this.isWhereCondition(condition)) {
      return this.formatSimpleCondition(condition, bindingManager);
    } else if (this.isWhereClause(condition)) {
      return this.formatComplexCondition(condition, bindingManager);
    } else {
      return '';
    }
  }

  /**
   * The function `formatComplexCondition` formats a complex condition with nested AND and OR clauses
   * in TypeScript.
   * @param {WhereClause} condition - The `condition` parameter is an object that represents a WHERE
   * clause in a SQL query. It can contain nested conditions with logical operators like AND and OR.
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter is an optional parameter
   * of type `QueryBinding` that is used in the `formatComplexCondition` method to provide additional
   * context or information for formatting the complex condition. It is not required for the method to
   * work, but can be passed in if needed.
   * @returns The `formatComplexCondition` function returns a string representing a complex condition
   * formed by combining multiple nested conditions using logical AND and OR operators. The nested
   * conditions are formatted using the `formatCondition` method and then joined together based on the
   * logical operators specified in the original `WhereClause` object. The final result is enclosed in
   * parentheses to maintain the correct order of operations.
   */
  private formatComplexCondition(
    condition: WhereClause,
    bindingManager?: QueryBinding,
  ): string {
    const nestedConditions: string[] = [];
    if (condition.and) {
      nestedConditions.push(
        condition.and
          .map(subCondition =>
            this.formatCondition(subCondition, bindingManager),
          )
          .join(' AND '),
      );
    }
    if (condition.or) {
      nestedConditions.push(
        condition.or
          .map(subCondition =>
            this.formatCondition(subCondition, bindingManager),
          )
          .join(' OR '),
      );
    }
    return `(${nestedConditions.join(' AND ')})`;
  }

  /**
   * The `formatSimpleCondition` function formats a simple condition by handling binding of values and
   * escaping special characters.
   * @param {WhereCondition} condition - The `condition` parameter in the `formatSimpleCondition`
   * function represents a single condition that needs to be formatted. It typically includes the field
   * name, operator, and value that make up a part of a SQL WHERE clause.
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter is an optional parameter
   * of type `QueryBinding`. It is used to manage bindings for query parameters in order to prevent SQL
   * injection attacks. If the `bindingManager` is provided, the `formatSimpleCondition` function will
   * use it to add bindings for the condition value.
   * @returns The function `formatSimpleCondition` returns a string that represents a formatted SQL
   * condition based on the input `condition`, with the value of the condition potentially being
   * formatted based on the presence of a `bindingManager`.
   */
  private formatSimpleCondition(
    condition: WhereCondition,
    bindingManager?: QueryBinding,
  ): string {
    let formattedValue;

    if (bindingManager) {
      // When bindingManager is defined, use it to add bindings
      const bindKey = bindingManager.addBinding(condition.value);
      formattedValue = `${bindKey}`;
    } else {
      // Directly use the condition value when bindingManager is undefined
      formattedValue =
        typeof condition.value === 'string'
          ? `'${condition.value.replace(/'/g, "''")}'`
          : condition.value;
    }
    const formattedField =
      typeof condition.field === 'string'
        ? condition.field
        : JSON.stringify(condition.field); // this can create trouble
    return `${formattedField} ${condition.operator} ${formattedValue}`;
  }

  /**
   * The function `isWhereCondition` checks if a given condition object has the required properties for
   * a WhereCondition and validates the 'value' property to accept subqueries or complex expressions.
   * @param {any} condition - The `condition` parameter is an object that represents a condition used
   * in a query. It should have the following properties:
   * @returns The function `isWhereCondition` is returning a boolean value. It returns `true` if the
   * `condition` parameter meets the specified criteria for a `WhereCondition` object, and `false`
   * otherwise.
   */
  // sonarignore:start
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isWhereCondition(condition: any): condition is WhereCondition {
    // sonarignore:end
    // Check if condition is an object and has 'field', 'operator', and 'value' properties
    if (
      typeof condition !== 'object' ||
      !('field' in condition) ||
      !('operator' in condition) ||
      !('value' in condition)
    ) {
      return false;
    }

    // Additional validation for 'value' to accept subqueries or complex expressions
    if (typeof condition.value === 'object') {
      return (
        'query' in condition.value ||
        typeof condition.value === 'string' ||
        typeof condition.value === 'number' ||
        typeof condition.value === 'boolean'
      );
    }

    return true;
  }

  /**
   * The function `isWhereClause` checks if a given object is a WhereClause by verifying the presence
   * of 'and' or 'or' keys.
   * @param {any} clause - The `clause` parameter is of type `any`, which means it can be any data type
   * in TypeScript.
   * @returns a boolean value indicating whether the input `clause` is a `WhereClause` or not.
   */
  // sonarignore:start
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isWhereClause(clause: any): clause is WhereClause {
    // sonarignore:end
    return 'and' in clause || 'or' in clause;
  }

  /**
   * This TypeScript function converts a structured query to a SQL query and returns the query string
   * along with the bindings.
   * @param {StructuredQueryInterface} query - The `jsonToQueryConverter` function takes a
   * `StructuredQueryInterface` object as a parameter. This object likely contains structured data that
   * needs to be converted into a SQL query along with bindings.
   * @returns The function `jsonToQueryConverter` returns an object with two properties: `query` which
   * is a string representing the SQL query generated from the input `StructuredQueryInterface`, and
   * `bind` which is an object containing the bindings used in the query.
   */
  public async jsonToQueryConverter(query: StructuredQueryInterface): Promise<{
    query: string;
    bind: AnyObject;
  }> {
    const bindingManager = await this.app.get<QueryBinding>(
      ReportingServiceComponentBindings.BINDING_MANAGER,
    );

    const sqlQuery = this.generateQuery(query, bindingManager);
    const bind = bindingManager.getBindings();
    return {query: sqlQuery, bind};
  }

  /**
   * The function generates a SQL query based on a structured query interface in TypeScript.
   * @param {StructuredQueryInterface} query - The `query` parameter in the `generateQuery` function
   * represents a structured query interface that contains information about the SQL query to be
   * generated. It includes details such as the SELECT clause, FROM clause, JOIN clause, WHERE clause,
   * ORDER BY clause, LIMIT, and OFFSET.
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter in the `generateQuery`
   * function is an optional parameter of type `QueryBinding`. It is used to manage bindings for the
   * query, which can be used to dynamically bind values to the query at runtime. If provided, the
   * `bindingManager` can be used to handle
   * @returns The `generateQuery` function returns a SQL query string based on the provided
   * `StructuredQueryInterface` object and optional `QueryBinding` object. The SQL query includes the
   * SELECT, FROM, JOIN, WHERE, ORDER BY, LIMIT, and OFFSET clauses based on the corresponding
   * properties of the `query` object.
   */
  private generateQuery(
    query: StructuredQueryInterface,
    bindingManager?: QueryBinding,
  ): string {
    let sqlQuery = 'SELECT ';

    sqlQuery += this.handleSelectClause(query.select, bindingManager);
    sqlQuery += this.handleFromClause(query.from, bindingManager);
    sqlQuery += this.handleJoinClause(query.join, bindingManager);
    sqlQuery += this.handleWhereClause(query, bindingManager);

    // Handle ORDER BY clause
    if (query.orderBy) {
      const orderByStrings = query.orderBy.map(order => {
        const fieldStr =
          typeof order.field === 'object'
            ? JSON.stringify(order.field)
            : order.field;
        return `${fieldStr} ${order.order.toUpperCase()}`;
      });

      sqlQuery += orderByStrings.length
        ? ' ORDER BY ' + orderByStrings.join(', ')
        : '';
    }

    // Handle LIMIT and OFFSET
    if (query.limit !== undefined) {
      sqlQuery += ` LIMIT ${query.limit}`;
    }
    if (query.offset !== undefined) {
      sqlQuery += ` OFFSET ${query.offset}`;
    }

    return sqlQuery;
  }

  /**
   * The function `handleJoinClause` generates SQL join clauses based on the provided JoinClause
   * objects and binding information.
   * @param {JoinClause[] | undefined} joinClauses - The `joinClauses` parameter is an array of objects
   * representing join clauses in a query. Each object in the array contains information about the join
   * type (`type`), the data source (`source`), and the join conditions (`on`). The `on` property can
   * be a single condition object or
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter in the `handleJoinClause`
   * function is used to manage query bindings. It is an optional parameter that allows you to pass a
   * `QueryBinding` object to handle bindings for the query conditions.
   * @returns The `handleJoinClause` function returns a string representing the SQL join query based on
   * the provided `JoinClause` array and optional `QueryBinding` object.
   */
  private handleJoinClause(
    joinClauses: JoinClause[] | undefined,
    bindingManager?: QueryBinding,
  ): string {
    if (!joinClauses) {
      return '';
    }

    let joinQuery = '';

    joinClauses.forEach(joinClause => {
      const source = this.formatDataSource(joinClause.source, bindingManager);
      const onConditions = (
        Array.isArray(joinClause.on) ? joinClause.on : [joinClause.on]
      )
        .map(condition => {
          const fieldPart = this.formatField(condition.field, bindingManager);

          if (condition.value === null) {
            return `${fieldPart} IS NULL`;
          }

          if (
            typeof condition.value === 'object' &&
            !Array.isArray(condition.value) &&
            'query' in condition.value
          ) {
            return `${fieldPart} ${condition.operator} (${this.generateQuery(condition.value.query, bindingManager)})`;
          }

          if (Array.isArray(condition.value)) {
            const values = condition.value.map(val => `'${val}'`).join(', '); // Assuming these are literals
            return `${fieldPart} ${condition.operator} (${values})`;
          }

          // Check if the value is a column reference
          if (condition.valueType === 'column') {
            const valueStr =
              typeof condition.value === 'object'
                ? JSON.stringify(condition.value)
                : condition.value;
            return `${fieldPart} ${condition.operator} ${valueStr}`;
          }

          // Treat as a literal value if bindingManager is undefined, otherwise use bindings
          if (bindingManager) {
            const bindKey = bindingManager.addBinding(condition.value);
            return `${fieldPart} ${condition.operator} ${bindKey}`;
          }

          let formattedValue;
          if (typeof condition.value === 'string') {
            formattedValue = `'${condition.value.replace(/'/g, "''")}'`;
          } else if (typeof condition.value === 'object') {
            formattedValue = JSON.stringify(condition.value);
          } else {
            formattedValue = condition.value;
          }
          return `${fieldPart} ${condition.operator} ${formattedValue}`;
        })
        .join(' AND ');

      joinQuery += ` ${joinClause.type} JOIN ${source} ON ${onConditions}`;
    });

    return joinQuery;
  }

  /**
   * The `formatDataSource` function takes a `DataSource` object and a `QueryBinding` object (optional)
   * and returns a formatted string based on the type of the `DataSource`.
   * @param {DataSource} dataSource - The `formatDataSource` function takes in a `dataSource`
   * parameter, which can be of type `string`, an object with a `source` and `alias` property, or an
   * object with a `query` and `alias` property. The function formats the `dataSource` based on its
   * type
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter in the `formatDataSource`
   * function is an optional parameter of type `QueryBinding`. It is used to provide additional
   * information or context for the data source being formatted. If provided, it can be used to assist
   * in generating the query for the data source. If not provided
   * @returns The `formatDataSource` function returns a string based on the type of the `dataSource`
   * parameter. If `dataSource` is a string, it simply returns the string itself. If `dataSource` has a
   * `source` property, it returns the source followed by an alias. If `dataSource` has a `query`
   * property, it generates a subquery using the `generateQuery` method and returns
   */
  private formatDataSource(
    dataSource: DataSource,
    bindingManager?: QueryBinding,
  ): string {
    if (typeof dataSource === 'string') {
      return dataSource;
    } else if ('source' in dataSource) {
      return `${dataSource.source} AS ${dataSource.alias}`;
    } else if ('query' in dataSource) {
      const subQueryResult = this.generateQuery(
        dataSource.query,
        bindingManager,
      );
      return `(${subQueryResult}) AS ${dataSource.alias}`;
    } else {
      throw new Error('Unsupported DataSource type');
    }
  }

  /**
   * The function `handleWhereClause` generates a WHERE clause for a SQL query based on the provided
   * conditions.
   * @param {StructuredQueryInterface} sqlQuery - The `sqlQuery` parameter is of type
   * `StructuredQueryInterface`, which likely represents a structured query used in a database
   * operation. It contains information about the query, such as the fields to select, tables to query,
   * and any conditions to apply.
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter in the `handleWhereClause`
   * function is an optional parameter of type `QueryBinding`. It is used to manage the bindings for
   * the SQL query, allowing for parameterized queries and preventing SQL injection attacks. If
   * provided, it is used in processing the `where` clause
   * @returns The `handleWhereClause` function returns a string representing the WHERE clause of a SQL
   * query. If the `sqlQuery` object does not have a `where` property, an empty string is returned.
   * Otherwise, the function processes the WHERE conditions using the `processWhereClause` method and
   * constructs the WHERE clause string by joining the conditions with 'AND'. The final WHERE clause
   * string is returned.
   */
  private handleWhereClause(
    sqlQuery: StructuredQueryInterface,
    bindingManager?: QueryBinding,
  ) {
    let query = '';
    if (!sqlQuery.where) {
      return query;
    }
    const whereConditions = this.processWhereClause(
      sqlQuery.where,
      bindingManager,
    );
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }
    return query;
  }
  private handleFromClause(from: DataSource, bindingManager?: QueryBinding) {
    let query = ' FROM ';

    if (typeof from === 'string') {
      query += from;
    } else if ('source' in from && 'alias' in from) {
      query += `${from.source} AS ${from.alias}`;
    } else if ('query' in from && 'alias' in from) {
      const subQueryResult = this.generateQuery(from.query, bindingManager);
      query += `(${subQueryResult}) AS ${from.alias}`;
    } else {
      this.logger.error(`Invalid DataSource format: ${JSON.stringify(from)}`);
      throw new Error('Invalid DataSource format');
    }

    return query;
  }

  /**
   * The function `handleSelectClause` generates a SELECT query string based on the provided fields and
   * distinct flag.
   * @param select - The `select` parameter in the `handleSelectClause` function is of type
   * `StructuredQueryInterface['select']`. It likely represents the selection criteria for a database
   * query, specifying which fields to retrieve from the database.
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter in the
   * `handleSelectClause` function is an optional parameter of type `QueryBinding`. It is used to
   * manage bindings for the query, which can be helpful for parameterized queries or managing query
   * parameters. If provided, it can be used to format the fields in the
   * @returns The `handleSelectClause` function returns a string representing the SELECT clause of a
   * SQL query based on the input parameters `select` and `bindingManager`. If the `select` parameter
   * does not have any fields specified, the function returns `' * '`, indicating that all fields
   * should be selected. Otherwise, it constructs the SELECT clause based on the specified fields and
   * whether the query should be distinct, and
   */
  private handleSelectClause(
    select: StructuredQueryInterface['select'],
    bindingManager?: QueryBinding,
  ) {
    let query = '';
    if (!select?.fields) {
      return ' * ';
    }
    if (select.distinct) {
      query += 'DISTINCT ';
    }

    const fieldStrings = select.fields.map(field =>
      this.formatField(field, bindingManager),
    );
    query += fieldStrings.join(', ');

    return query;
  }

  /**
   * The `formatField` function in TypeScript formats a field expression, handling different types of
   * expressions and applying aliases if present.
   * @param {FieldExpression} field - The `field` parameter in the `formatField` function represents
   * the field expression that needs to be formatted. It can be a string, a function expression, a
   * subquery with an alias, or an alias expression. The function processes the field based on its type
   * and returns a formatted string representation of
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter in the `formatField`
   * function is used to provide additional context or information for formatting the field expression.
   * It is an optional parameter of type `QueryBinding` that can be passed to the function to assist in
   * generating the SQL representation of the field expression. If provided,
   * @returns The `formatField` method returns a string representing the formatted field expression
   * based on the input `field` parameter. The method handles different types of field expressions such
   * as basic string fields, function expressions, subqueries with aliases, and alias expressions. The
   * final formatted field string may include the field itself, function calls with arguments,
   * subqueries, and aliases if present.
   */
  private formatField(
    field: FieldExpression,
    bindingManager?: QueryBinding,
  ): string {
    // Initial part remains the same to handle basic string fields
    if (typeof field === 'string') {
      return field;
    }

    let fieldSql: string;

    if (this.isFunctionExpression(field)) {
      const argsSql = field.args
        .map(arg => this.formatField(arg, bindingManager))
        .join(', ');
      fieldSql = `${field.function}(${argsSql})`;
    } else if (this.isSubQueryWithAlias(field)) {
      const subQueryResult = this.generateQuery(field.query, bindingManager);
      fieldSql = `(${subQueryResult})`;
    } else if (this.isAliasExpression(field)) {
      // If it's an alias expression, recursively call formatField for the inner field
      fieldSql = this.formatField(field.field, bindingManager);
    } else {
      throw new Error(`Unsupported FieldExpression type: ${typeof field}`);
    }

    // Apply the alias if present, considering AliasExpressions and other expressions with aliases
    return field.alias ? `${fieldSql} AS ${field.alias}` : fieldSql;
  }

  /**
   * The function `isAliasExpression` checks if a given expression is an AliasExpression by verifying
   * the presence of 'alias' and 'field' properties.
   * @param {any} expression - The `expression` parameter is a variable of type `any`, which means it
   * can hold values of any data type in TypeScript.
   * @returns The function `isAliasExpression` is returning a boolean value indicating whether the
   * provided `expression` is of type `AliasExpression`. It checks if the `expression` is truthy and if
   * it has both the properties `alias` and `field`. If these conditions are met, the function returns
   * `true`, indicating that the `expression` is an `AliasExpression`. Otherwise, it returns `false
   */
  // sonarignore:start
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isAliasExpression(expression: any): expression is AliasExpression {
    // sonarignore:end
    return expression && 'alias' in expression && 'field' in expression;
  }

  /**
   * The function `isFunctionExpression` checks if a given expression is a FunctionExpression by
   * verifying its structure.
   * @param {any} expression - The `expression` parameter is of type `any`, which means it can be any
   * data type in TypeScript. The `isFunctionExpression` function is checking if the `expression` is a
   * `FunctionExpression` by verifying if it is truthy, has a property 'function', and if it has an
   * @returns The `isFunctionExpression` function is checking if the `expression` is a
   * `FunctionExpression` by verifying if it is truthy, has a property 'function', and if 'args' is an
   * array. If all conditions are met, it returns `true`, indicating that the `expression` is a
   * `FunctionExpression`. Otherwise, it returns `false`.
   */
  private isFunctionExpression(
    // sonarignore:start
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expression: any,
    // sonarignore:end
  ): expression is FunctionExpression {
    return (
      expression && 'function' in expression && Array.isArray(expression.args)
    );
  }

  /**
   * The function `isSubQueryWithAlias` checks if an expression is a subquery with an alias.
   * @param {any} expression - The `expression` parameter is a variable that can hold any value. The
   * `isSubQueryWithAlias` function checks if the `expression` is of type `SubQueryWithAlias`, which is
   * an object with a property `query`.
   * @returns The function `isSubQueryWithAlias` is returning a boolean value indicating whether the
   * `expression` is of type `SubQueryWithAlias`.
   */
  private isSubQueryWithAlias(
    // sonarignore:start
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expression: any,
    //sonarignore:end
  ): expression is SubQueryWithAlias {
    return (
      expression && typeof expression === 'object' && 'query' in expression
    );
  }

  /**
   * The function `processWhereClause` processes a given where clause object to generate an array of
   * SQL conditions.
   * @param {WhereClause} whereClause - The `whereClause` parameter is an object that contains the
   * conditions used to filter the results of a query. It can include simple conditions like `{ age: 30
   * }` or complex conditions like `{ or: [{ age: 30 }, { name: 'Alice' }] }`. The `process
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter in the
   * `processWhereClause` function is an optional parameter of type `QueryBinding`. It is used to
   * provide additional information or context for the query being processed. If provided, the
   * `bindingManager` can be used to handle query bindings or parameters within the generated SQL
   * @returns The `processWhereClause` function returns an array of strings representing the processed
   * where conditions based on the input `whereClause`.
   */
  private processWhereClause(
    whereClause: WhereClause,
    bindingManager?: QueryBinding,
  ): string[] {
    const whereConditions: string[] = [];

    Object.entries(whereClause).forEach(([key, value]) => {
      if (value === undefined) return;

      if (key === 'and' || key === 'or') {
        // Process complex conditions (and/or)
        const conditionStrings = this.processComplexCondition(
          value,
          key.toUpperCase(),
          bindingManager,
        );
        whereConditions.push(
          `(${conditionStrings.join(' ' + key.toUpperCase() + ' ')})`,
        );
      } else if (this.isWhereCondition(value)) {
        // Process simple conditions
        const conditionString = this.processSimpleCondition(
          value,
          bindingManager,
        );
        whereConditions.push(conditionString);
      }
    });

    return whereConditions;
  }

  /**
   * The function `processComplexCondition` processes a list of conditions, handling both simple
   * conditions and nested conditions with logical operators.
   * @param {(WhereCondition | WhereClause)[]} conditions - The `conditions` parameter in the
   * `processComplexCondition` function is an array that can contain elements of type `WhereCondition`
   * or `WhereClause`. These elements represent individual conditions or nested conditions that need to
   * be processed based on the specified operator. The function iterates over each element in the `
   * @param {string} operator - The `operator` parameter in the `processComplexCondition` function is a
   * string that represents the logical operator to be used for combining multiple conditions. Common
   * logical operators include "AND", "OR", etc. This operator is used to join the individual
   * conditions within the `conditions` array when constructing the final
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter in the
   * `processComplexCondition` function is used to manage query bindings, which are used to bind values
   * to placeholders in the query. It is an optional parameter that allows you to pass a `QueryBinding`
   * object to the function to handle bindings for the conditions being processed
   * @returns The `processComplexCondition` function returns an array containing the joined conditions
   * string with the specified operator.
   */
  private processComplexCondition(
    conditions: (WhereCondition | WhereClause)[],
    operator: string,
    bindingManager?: QueryBinding,
  ): string[] {
    const nestedConditions: string[] = [];

    for (const condition of conditions) {
      if (this.isWhereCondition(condition)) {
        // Correctly pass only WhereCondition items to processSimpleCondition
        const conditionString = this.processSimpleCondition(
          condition,
          bindingManager,
        );
        nestedConditions.push(conditionString);
      } else {
        // Handle WhereClause by recursively calling processWhereClause
        const conditionStrings = this.processWhereClause(
          condition,
          bindingManager,
        );
        nestedConditions.push(
          `(${conditionStrings.join(' ' + operator + ' ')})`,
        ); // Join nested conditions with the operator
      }
    }

    // Return an array containing the joined conditions string and the updated valueIndex
    return [nestedConditions.join(' ' + operator + ' ')];
  }

  /**
   * The function `processSimpleCondition` processes different types of conditions, including subquery
   * conditions, column references, and simple literal conditions.
   * @param {WhereCondition} condition - The `condition` parameter in the `processSimpleCondition`
   * function represents a single condition that needs to be processed. It contains information such as
   * the field to apply the condition on, the operator to use for comparison, the value to compare
   * against, and the type of value (literal, column reference,
   * @param {QueryBinding} [bindingManager] - The `bindingManager` parameter in the
   * `processSimpleCondition` function is an optional parameter of type `QueryBinding`. It is used to
   * manage bind parameters for the query. If provided, it allows the function to use bind parameters
   * for values instead of directly inserting them into the query string. This helps
   * @returns The `processSimpleCondition` function returns a string representing the processed
   * condition based on the input `condition` and `bindingManager` parameters.
   */
  private processSimpleCondition(
    condition: WhereCondition,
    bindingManager?: QueryBinding,
  ): string {
    let conditionString: string;

    if (this.isSubQueryWithAlias(condition.value)) {
      // Process subquery conditions
      const subQueryResult = this.generateQuery(
        condition.value.query,
        bindingManager,
      );
      conditionString = `${this.formatField(condition.field, bindingManager)} ${
        condition.operator
      } (${subQueryResult})`;
      // Subquery bind parameters are merged by generateQuery method
    } else if (condition.valueType === 'column') {
      // Treat the condition value as a column reference, not a bind parameter
      const columnReference = this.formatField(
        condition.value as FieldExpression,
        bindingManager,
      );
      conditionString = `${this.formatField(condition.field, bindingManager)} ${
        condition.operator
      } ${columnReference}`;
    } else {
      // Process simple literal conditions
      let formattedValue;
      if (bindingManager) {
        // Use bind parameters if bindingManager is provided
        const bindKey = bindingManager.addBinding(condition.value);
        formattedValue = `${bindKey}`;
      } else {
        // Directly use the value, properly formatted, if bindingManager is not provided
        formattedValue =
          typeof condition.value === 'string'
            ? `'${condition.value.replace(/'/g, "''")}'`
            : condition.value;
      }
      conditionString = `${this.formatField(condition.field, bindingManager)} ${condition.operator} ${formattedValue}`;
    }

    return conditionString;
  }

  /**
   * The function `validateQueryObject` in TypeScript validates various clauses of a structured query
   * object.
   * @param {StructuredQueryInterface} query - The `validateQueryObject` function takes a `query`
   * parameter of type `StructuredQueryInterface`. This parameter represents a structured query object
   * that likely contains information about the select clause, from clause, join clauses, where clause,
   * orderBy clause, groupBy clause, having clause, limit, and offset.
   * @returns The `validateQueryObject` function returns a boolean value. It returns `true` if all
   * validations pass for the select clause, from clause, join clauses, and where clause in the
   * provided `query` object. If any validation fails, an error message is logged and the function
   * returns `false`.
   */
  public validateQueryObject(query: StructuredQueryInterface): boolean {
    // Validate the select clause
    if (!this.validateSelectClause(query.select)) {
      this.logger.error('Invalid select clause.');
      return false;
    }

    // Validate the from clause
    if (!this.validateDataSource(query.from)) {
      this.logger.error('Invalid from clause.');
      return false;
    }

    // Validate join clauses if present
    if (query.join && !this.validateJoinClauses(query.join)) {
      this.logger.error('Invalid join clauses.');
      return false;
    }

    // Validate where clause if present
    if (query.where && !this.validateWhereClause(query.where)) {
      this.logger.error('Invalid where clause.');
      return false;
    }

    return true;
  }

  /**
   * The function `validateSelectClause` validates a select clause by checking if it exists and has at
   * least one field, and then validating each field expression within the clause.
   * @param {SelectClause | undefined} select - The `select` parameter in the `validateSelectClause`
   * function represents the select clause of a query. It is of type `SelectClause` or `undefined`. The
   * function validates the select clause to ensure that it exists and contains at least one field. It
   * also validates each field within the select clause
   * @returns The `validateSelectClause` function returns a boolean value. It returns `true` if the
   * select clause is valid (exists and has at least one field with valid expressions), and `false`
   * otherwise.
   */
  private validateSelectClause(select: SelectClause | undefined): boolean {
    if (!select?.fields || select.fields.length === 0) {
      return false; // Select clause must exist and must have at least one field
    }

    // Validate each field in the select clause
    for (const field of select.fields) {
      if (!this.validateFieldExpression(field)) {
        return false;
      }
    }

    return true;
  }

  /**
   * The function `validateDataSource` checks the validity of different types of data sources in
   * TypeScript.
   * @param {DataSource} dataSource - The `validateDataSource` function takes a `dataSource` parameter
   * and validates it based on its structure.
   * @returns The `validateDataSource` function returns a boolean value - `true` if the `dataSource`
   * parameter passes one of the validation conditions for string data sources, `DataSourceWithAlias`,
   * or `SubQueryWithAlias`, and `false` if none of the conditions match, indicating that the data
   * source is invalid.
   */
  private validateDataSource(dataSource: DataSource): boolean {
    if (typeof dataSource === 'string') {
      // Validation logic for string data sources, e.g., table names
      return true;
    } else if ('source' in dataSource && 'alias' in dataSource) {
      // DataSourceWithAlias validation
      return true;
    } else if ('query' in dataSource && 'alias' in dataSource) {
      // SubQueryWithAlias validation, might include recursive query object validation
      return this.validateQueryObject(dataSource.query);
    }

    return false; // If none of the conditions match, the data source is invalid
  }

  /**
   * The function `validateJoinClauses` iterates through an array of `JoinClause` objects and validates
   * the `source` and `on` conditions for each join.
   * @param {JoinClause[]} joins - The `joins` parameter is an array of `JoinClause` objects that
   * contain information about the join operation in a query, such as the data sources involved and the
   * join conditions.
   * @returns The `validateJoinClauses` method returns a boolean value. It returns `true` if all join
   * clauses pass validation, and `false` if any join clause fails validation.
   */
  private validateJoinClauses(joins: JoinClause[]): boolean {
    for (const join of joins) {
      if (
        !this.validateDataSource(join.source) ||
        !this.validateJoinOnCondition(join.on)
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * The function `validateJoinOnCondition` validates whether a given join condition or an array of
   * join conditions are valid.
   * @param {WhereCondition | WhereCondition[]} onCondition - The `onCondition` parameter in the
   * `validateJoinOnCondition` method can be either a single `WhereCondition` object or an array of
   * `WhereCondition` objects. The method validates whether the provided `onCondition` is valid by
   * checking if it meets the criteria specified in the `validateWhere
   * @returns A boolean value is being returned.
   */
  private validateJoinOnCondition(
    onCondition: WhereCondition | WhereCondition[],
  ): boolean {
    if (Array.isArray(onCondition)) {
      return onCondition.every(cond => this.validateWhereCondition(cond));
    } else {
      return this.validateWhereCondition(onCondition);
    }
  }

  /**
   * The function `validateWhereClause` in TypeScript validates 'and' and 'or' conditions in a given
   * WhereClause object.
   * @param {WhereClause} where - The `where` parameter in the `validateWhereClause` function
   * represents a WhereClause object that contains conditions for filtering data. The function
   * validates the 'and' and 'or' conditions within the WhereClause to ensure they are correctly
   * formatted.
   * @returns The `validateWhereClause` method returns a boolean value.
   */
  private validateWhereClause(where: WhereClause): boolean {
    // Validate 'and' and 'or' conditions if present
    if (
      where.and &&
      !where.and.every(condition =>
        this.validateWhereConditionOrClause(condition),
      )
    ) {
      return false;
    }
    if (
      where.or &&
      !where.or.every(condition =>
        this.validateWhereConditionOrClause(condition),
      )
    ) {
      return false;
    }
    return true;
  }

  /**
   * The function `validateWhereConditionOrClause` validates whether a given input is a WhereCondition
   * or WhereClause.
   * @param {WhereCondition | WhereClause} condition - The `condition` parameter in the
   * `validateWhereConditionOrClause` method can be either a `WhereCondition` or a `WhereClause`. The
   * method checks the type of the condition and then calls the appropriate validation method based on
   * whether it is a `WhereCondition` or a `WhereClause`.
   * @returns The `validateWhereConditionOrClause` method returns a boolean value based on whether the
   * input `condition` is a valid `WhereCondition` or `WhereClause`. If the `condition` is a
   * `WhereCondition`, it calls the `validateWhereCondition` method and returns its result. If the
   * `condition` is a `WhereClause`, it calls the `validateWhereClause` method and returns
   */
  private validateWhereConditionOrClause(
    condition: WhereCondition | WhereClause,
  ): boolean {
    if (this.isWhereCondition(condition)) {
      return this.validateWhereCondition(condition);
    } else if (this.isWhereClause(condition)) {
      return this.validateWhereClause(condition);
    }
    return false;
  }

  /**
   * The function `validateWhereCondition` validates the field, operator, and value of a given
   * `WhereCondition` object.
   * @param {WhereCondition} condition - The `condition` parameter in the `validateWhereCondition`
   * function represents a single condition used in a query. It typically includes the following
   * properties:
   * @returns The `validateWhereCondition` method returns a boolean value.
   */
  private validateWhereCondition(condition: WhereCondition): boolean {
    // Validate field, operator, and value
    if (!this.validateFieldExpression(condition.field)) {
      return false;
    }

    if (
      condition.value !== null &&
      typeof condition.value === 'object' &&
      'query' in condition.value
    ) {
      return this.validateQueryObject(condition.value.query);
    }

    return true;
  }

  /**
   * The function `validateFieldExpression` checks the validity of a given field expression in
   * TypeScript, handling different types of expressions such as strings, aliases, functions, and
   * subqueries.
   * @param {FieldExpression} field - The `validateFieldExpression` function takes a `field` parameter
   * of type `FieldExpression`. The function validates the field expression based on its type and
   * structure. If the field is a simple string, an alias expression, a function expression, or a
   * subquery with an alias, the function returns `
   * @returns The `validateFieldExpression` function returns a boolean value - `true` if the field
   * expression is valid based on the conditions checked within the function, and `false` if none of
   * the conditions match, indicating that the field expression is invalid.
   */
  private validateFieldExpression(field: FieldExpression): boolean {
    if (typeof field === 'string') {
      // Simple string field validation logic
      return true;
    } else if (
      this.isAliasExpression(field) ||
      this.isFunctionExpression(field)
    ) {
      // AliasExpression and FunctionExpression validation logic
      return true;
    } else if (this.isSubQueryWithAlias(field)) {
      // SubQueryWithAlias validation logic, might include recursive query object validation
      return this.validateQueryObject(field.query);
    }

    return false; // If none of the conditions match, the field expression is invalid
  }

  /**
   * This TypeScript function extracts all data sources from a structured query object, handling 'from'
   * and 'join' clauses, subqueries in 'where' conditions and 'select' fields, and optionally removing
   * schema names.
   * @param {StructuredQueryInterface} query - The `query` parameter in the
   * `listAllDataSourcesFromJson` function represents a structured query interface that contains
   * information about the data sources being queried. It is used to extract data sources from various
   * parts of the query, such as the 'from' clause, 'join' clauses, subqueries
   * @param [removeSchema=false] - The `removeSchema` parameter in the `listAllDataSourcesFromJson`
   * function is a boolean flag that indicates whether to remove the schema part from the data source
   * names before returning them. If `removeSchema` is set to `true`, the function will extract only
   * the last part of the data
   * @returns The function `listAllDataSourcesFromJson` returns an array of strings containing all data
   * sources extracted from the provided `query` object. The data sources are extracted from the 'from'
   * clause, 'join' clauses, subqueries within 'where' conditions, and subqueries within 'select'
   * fields. The function also has an optional parameter `removeSchema` which, if set to true,
   */
  public listAllDataSourcesFromJson(
    query: StructuredQueryInterface,
    removeSchema = false,
  ): string[] {
    let allDataSources: string[] = [];

    // Handle 'from' clause
    const fromSources = this.extractDataSources(query.from);
    allDataSources.push(...fromSources);

    // Handle 'join' clauses
    if (query.join) {
      query.join.forEach(join => {
        const joinSources = this.extractDataSources(join.source);
        allDataSources.push(...joinSources);
      });
    }

    // Handle subqueries within 'where' conditions, if any
    if (query.where) {
      this.extractSubQueryDataSources(query.where, allDataSources);
    }

    // Handle subqueries within 'select' fields, if any
    if (query.select?.fields) {
      query.select.fields.forEach(field => {
        if (this.isSubQueryWithAlias(field)) {
          const subQuerySources = this.listAllDataSourcesFromJson(
            field.query,
            removeSchema,
          );
          allDataSources.push(...subQuerySources);
        }
      });
    }

    // Use a Set to filter out duplicate data source names
    allDataSources = Array.from(new Set(allDataSources));

    // Optionally remove schema from data source names
    if (removeSchema) {
      allDataSources = allDataSources.map(ds => {
        const parts = ds.split('.');
        return parts[parts.length - 1];
      });
    }

    return allDataSources;
  }

  /**
   * The function `extractDataSources` takes a `DataSource` object and returns an array of data sources
   * based on its structure.
   * @param {DataSource} dataSource - The `dataSource` parameter in the `extractDataSources` function
   * can be of type `string` or an object with either a `source` property or a `query` property.
   * @returns An array of strings representing data sources is being returned.
   */
  private extractDataSources(dataSource: DataSource): string[] {
    if (typeof dataSource === 'string') {
      return [dataSource];
    } else if ('source' in dataSource) {
      return [dataSource.source];
    } else if ('query' in dataSource) {
      return this.listAllDataSourcesFromJson(dataSource.query);
    }
    return [];
  }

  /**
   * The function `extractSubQueryDataSources` recursively extracts data sources from nested conditions
   * in a WhereClause object.
   * @param {WhereCondition | WhereClause} condition - The `condition` parameter in the
   * `extractSubQueryDataSources` function is used to represent a condition in a WHERE clause of a SQL
   * query. It can be either a single condition (WhereCondition) or a group of conditions (WhereClause)
   * combined with logical operators like 'AND' or '
   * @param {string[]} allDataSources - The `allDataSources` parameter is an array of strings that
   * contains the names of all data sources. This array is used to store the data sources extracted
   * from the subqueries found in the `condition` parameter.
   */
  private extractSubQueryDataSources(
    condition: WhereCondition | WhereClause,
    allDataSources: string[],
  ): void {
    if ('and' in condition || 'or' in condition) {
      // If the condition is a WhereClause, recursively handle its nested conditions
      const conditions = condition.and ?? condition.or ?? [];
      conditions.forEach(nestedCondition =>
        this.extractSubQueryDataSources(nestedCondition, allDataSources),
      );
    } else if (this.isWhereCondition(condition)) {
      // Check if condition.value is an object and contains a 'query' property
      const value = condition.value;
      if (typeof value === 'object' && value !== null && 'query' in value) {
        // Ensure value is treated as SubQueryWithAlias and it has a subquery in its value
        allDataSources.push(...this.listAllDataSourcesFromJson(value.query));
      }
    }
  }

  /**
   * The function `extractField` takes a `FieldExpression` parameter and returns a string based on its
   * type and properties.
   * @param {FieldExpression} field - The `field` parameter in the `extractField` function is a
   * FieldExpression type, which can be either a string, an object with an `alias` property, or an
   * object with a `function` property. If it is a string, the function returns the string itself. If
   * it has
   * @returns The `extractField` function returns a string based on the type of the `field` parameter
   * provided. Here is a breakdown of the return values for different cases:
   */
  private extractField(field: FieldExpression): string {
    if (typeof field === 'string') {
      return field;
    } else if ('alias' in field && field.alias) {
      // Ensure field.alias is not undefined
      return field.alias;
    } else if ('function' in field) {
      // Construct the function representation and ensure it's never undefined
      const functionRepresentation = `${field.function}(${field.args
        .map(arg => this.extractField(arg))
        .join(', ')})`;
      return field.alias ?? functionRepresentation ?? 'unknown_function';
    } else {
      // Fallback for unsupported FieldExpression types
      return 'unknown_field';
    }
  }
}
