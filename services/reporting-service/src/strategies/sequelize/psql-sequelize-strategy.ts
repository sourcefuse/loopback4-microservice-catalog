import {inject} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {QueryTypes, Sequelize} from 'sequelize';
import {
  ColumnEntityPair,
  ColumnForDataSourceModel,
  DataSourceList,
  IngestReportRecord,
  QueryUtilityInterface,
  StructuredQueryInterface,
} from '../../interfaces';
import {ReportingServiceComponentBindings} from '../../keys';
import {BaseSequelize} from './base-sequelize';

/* The `PsqlSequelizeStrategy` class is a TypeScript class that provides methods for interacting with a
PostgreSQL database using the Sequelize ORM. */
export class PsqlSequelizeStrategy extends BaseSequelize {
  sequelize: Sequelize;
  queryUtil: QueryUtilityInterface;
  constructor(
    @inject(ReportingServiceComponentBindings.DATA_STORE_SERVICE_PROVIDER)
    sequelizeObj: Sequelize,
    @inject(LOGGER.LOGGER_INJECT)
    logger: ILogger,
    @inject(ReportingServiceComponentBindings.QUERY_UTILITY)
    queryUtility: QueryUtilityInterface,
  ) {
    super(logger, queryUtility);
    this.sequelize = sequelizeObj;
    this.queryUtil = queryUtility;
  }

  /**
   * This function retrieves a list of data sources from a database and formats them into an array of
   * DataSourceList objects.
   * @returns The `listdataSources` function returns an array of objects with properties
   * `dataSourceName` and `displayName`. Each object in the array represents a data source retrieved
   * from the database query. The `dataSourceName` property is a combination of the `table_schema` and
   * `table_name` values from the database query result, while the `displayName` property is also a
   * combination of the `table_schema`
   */
  async listdataSources(): Promise<DataSourceList[]> {
    const query = `
        SELECT table_name,table_schema
        FROM information_schema.tables
        WHERE table_type IN ('BASE TABLE', 'VIEW')
          AND table_schema NOT IN ('information_schema', 'pg_catalog')
      `;

    const result = await this.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    const resp = result.map((item: AnyObject) => {
      return {
        dataSourceName: `${item.table_schema}.${item.table_name}`,
        displayName: `${item.table_schema}.${item.table_name}`,
      };
    });

    return resp;
  }

  /**
   * This TypeScript function asynchronously executes a query based on a provided query object or SQL
   * string using Sequelize and returns the result as an array of objects.
   * @param {StructuredQueryInterface | string} queryObject - The `queryObject` parameter in the
   * `query` function can be either a `StructuredQueryInterface` object or a string representing a
   * query. If the `queryObject` is not a string, it is first translated into a SQL query using the
   * `translateQuery` method before executing the query using
   * @returns The `query` function returns a Promise that resolves to an array of objects
   * (`AnyObject[]`) representing the result of the executed query.
   */
  async query(
    queryObject: StructuredQueryInterface | string,
  ): Promise<AnyObject[]> {
    let result;

    try {
      if (typeof queryObject !== 'string') {
        const sqlObject = await this.translateQuery(queryObject);

        result = await this.sequelize.query(sqlObject.query, {
          bind: sqlObject.bind,
          type: QueryTypes.SELECT,
        });
      } else {
        result = await this.sequelize.query(queryObject, {
          type: QueryTypes.SELECT,
        });
      }
      return result;
    } catch (error) {
      throw new Error(error.message ?? 'Error executing query');
    }
  }

  /**
   * The function `listDataSourceColumns` retrieves column information for a given data source using a
   * SQL query.
   * @param {string} dataSource - The `dataSource` parameter is a string that represents the name of
   * the data source or table from which you want to fetch the columns.
   * @returns a Promise that resolves to an array of objects of type `ColumnForDataSourceModel`.
   */
  async listDataSourceColumns(
    dataSource: string,
  ): Promise<ColumnForDataSourceModel[]> {
    const {schema, tableName} = this.getSchemaAndTable(dataSource);
    const query = `
      SELECT column_name,table_schema,table_name,data_type
      FROM information_schema.columns
      where table_name = '${tableName}'
      and table_schema = '${schema}'
      AND table_schema NOT IN ('information_schema', 'pg_catalog')
     
    `;
    let result;
    try {
      result = await this.sequelize.query(query, {
        type: QueryTypes.SELECT,
      });
    } catch (error) {
      throw new Error(`Error in fetching columns ${JSON.stringify(error)}`);
    }

    return this.generateColumnForTable(result);
  }

  /**
   * The function `checkIfDataSourceExists` checks if a list of data source names exist in the
   * database.
   * @param {string[]} dataSourceNames - An array of strings representing the names of the data sources
   * to check.
   * @returns The function `checkIfDataSourceExists` returns a Promise that resolves to a boolean
   * value.
   */
  async checkIfDataSourceExists(dataSourceNames: string[]): Promise<boolean> {
    const placeholders = dataSourceNames
      .map((_, index) => `$${index + 1}`)
      .join(', ');
    const query = `
      SELECT count(*)
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('information_schema', 'pg_catalog')
        AND table_name IN (${placeholders})
    `;

    // For positional parameters, we use an array for `bind`
    const bindParams = dataSourceNames;

    const result: AnyObject = await this.sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: bindParams,
    });

    let resp = false;
    if (parseInt(result[0].count, 10) === dataSourceNames.length) {
      resp = true;
    }
    return resp;
  }

  /**
   * The function `checkIfColumnsExists` checks if a list of column-entity pairs exists in the
   * database.
   * @param {ColumnEntityPair[]} columnEntityPairs - An array of objects, where each object represents
   * a pair of column and entity. Each object should have the following properties:
   * @returns The function `checkIfColumnsExists` returns a Promise that resolves to a boolean value.
   */
  async checkIfColumnsExists(
    columnEntityPairs: ColumnEntityPair[],
  ): Promise<boolean> {
    const queries = columnEntityPairs.map(
      (pair, pairIndex) => `
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = :tableName${pairIndex + 1}
            AND column_name = :columnName${pairIndex + 1}
        `,
    );

    const allPairs = columnEntityPairs.reduce(
      (acc, pair, pairIndex) => {
        acc[`tableName${pairIndex + 1}`] = pair.dataSourceName;
        acc[`columnName${pairIndex + 1}`] = pair.column;
        return acc;
      },
      {} as Record<string, string>,
    );

    const query = `SELECT COUNT(*) FROM (${queries.join(
      ' UNION ALL ',
    )}) AS checks`;

    const result: AnyObject = await this.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: allPairs,
    });

    return parseInt(result[0].count, 10) === columnEntityPairs.length;
  }
  /**
   * The function applies a row-level filter to a query and returns the modified query.
   * @param {StructuredQueryInterface} initialQuery - The initialQuery parameter is an instance of the
   * StructuredQueryInterface. It represents the initial query that you want to apply a row-level
   * filter to.
   * @returns The initialQuery is being returned.
   */
  async applyRowLevelFilter(
    initialQuery: StructuredQueryInterface,
  ): Promise<StructuredQueryInterface> {
    return initialQuery;
  }
  /**
   * The function `manageRecord` handles different operations (INSERT, UPDATE, DELETE) on a given data
   * source using a specified identifier.
   * @param {string} dataSource - A string representing the data source where the record will be
   * managed. This could be a database table, a file, or any other source of data.
   * @param {CDC} data - The `data` parameter is an object that represents a change in the data. It
   * typically contains the following properties:
   * @param {string} [identifier=id] - The `identifier` parameter is a string that represents the
   * unique identifier for the record in the data source. It is used to identify the record that needs
   * to be updated or deleted.
   * @returns The `manageRecord` function returns a Promise that resolves to an `AnyObject` object.
   */
  async manageRecord(
    dataSource: string,
    data: IngestReportRecord,
    identifier = 'id',
  ): Promise<AnyObject> {
    if (data.cdc) {
      switch (data.cdc.operation) {
        case 'INSERT':
        case 'UPDATE':
          return this.upsertRecord(dataSource, data, identifier);
        case 'DELETE':
          return this.deleteRecord(dataSource, data, identifier);
        default:
          throw new Error(`Unsupported operation: ${data.cdc.operation}`);
      }
    }
    return {};
  }
  /**
   * The `upsertRecord` function inserts or updates a record in a specified data source using the
   * provided data, with support for sanitization and conflict resolution.
   * @param {string} dataSource - The `dataSource` parameter is a string that represents the name of
   * the table or data source where the record will be inserted or updated.
   * @param {CDC} data - The `data` parameter is an object that represents the data to be upserted into
   * the database. It should have a property called `currentValue` which contains the actual data to be
   * inserted or updated.
   * @param {string} [identifier=id] - The `identifier` parameter is a string that specifies the column
   * name used as the identifier for upserting records. In the code, it is set to `'id'` by default,
   * but you can provide a different column name if needed.
   * @returns an object with a property "affectedRecords" which contains the result of the upsert
   * operation.
   */
  private async upsertRecord(
    dataSource: string,
    data: IngestReportRecord,
    identifier = 'id',
  ): Promise<AnyObject> {
    if (!data.cdc) {
      throw new Error('Invalid data, CDC should be present');
    }
    const sanitizedData = Object.fromEntries(
      Object.entries(data.cdc.currentValue).map(([key, value]) => [
        key,
        super.sanitizeValue(value),
      ]),
    );

    const keys = Object.keys(sanitizedData).join(', ');
    const bind: AnyObject = {};
    const bindValues = Object.values(sanitizedData).map((val, index) => {
      bind[`param${index + 1}`] = val;
      return `$param${index + 1}`;
    });

    const updatePlaceholders = Object.keys(sanitizedData)
      .map((key, index) => `${key} = EXCLUDED.${key}`)
      .join(', ');

    const query = `
      INSERT INTO ${dataSource} (${keys}) VALUES (${bindValues.join(', ')})
      ON CONFLICT (${identifier})
      DO UPDATE SET ${updatePlaceholders};
    `;
    let result;
    try {
      result = await this.sequelize.query(query, {
        bind: bind,
        type: QueryTypes.UPSERT,
      });
    } catch (error) {
      throw new Error(error.message ?? 'Error executing manageRecord query');
    }

    return {affectedRecords: result};
  }
  /**
   * The `deleteRecord` function deletes a record from a specified data source using the provided
   * identifier.
   * @param {string} dataSource - The `dataSource` parameter is a string that represents the name of
   * the table or data source from which the record needs to be deleted.
   * @param {CDC} data - The `data` parameter is an object that represents the change data capture
   * (CDC) for a record. It contains the current value of the record being deleted.
   * @param {string} identifier - The `identifier` parameter is a string that represents the column
   * name in the database table that uniquely identifies a record. It is used in the `WHERE` clause of
   * the delete query to specify which record(s) should be deleted.
   * @returns an object with a property "affectedRecords" which contains the result of the delete
   * operation.
   */
  private async deleteRecord(
    dataSource: string,
    data: IngestReportRecord,
    identifier: string,
  ): Promise<AnyObject> {
    const ds = this.queryUtil.listAllDataSourcesFromJson(
      {
        select: [],
        from: dataSource,
      } as StructuredQueryInterface,
      true,
    );
    if (!data.recordId) {
      throw new Error('Invalid data, recordId should be present');
    }
    const [dataSourceExists, columnsExist] = await Promise.all([
      this.checkIfDataSourceExists(ds),
      this.checkIfColumnsExists([{dataSourceName: ds[0], column: identifier}]),
    ]);

    if (!dataSourceExists || !columnsExist) {
      throw new Error('Invalid dataSource or identifier');
    }
    const deleteQuery = `DELETE FROM ${dataSource} WHERE ${identifier} = $identifierValue`;
    try {
      const result = await this.sequelize.query(deleteQuery, {
        bind: {identifierValue: data.recordId},
        type: QueryTypes.DELETE,
      });
      return {affectedRecords: result};
    } catch (error) {
      throw new Error(error.message ?? 'Error executing delete query');
    }
  }
  /* The `getSchemaAndTable` function is a helper function that takes a `dataSourceName` string as input
and splits it into two parts: the schema and the table name. It uses the `split` method to split the
string at the '.' character and assigns the resulting parts to the `schema` and `tableName`
variables. Finally, it returns an object with the `schema` and `tableName` values. */
  getSchemaAndTable(dataSourceName: string) {
    const [schema, tableName] = dataSourceName.split('.');
    return {schema, tableName};
  }

  /**
   * The function generates columns for a table by converting the data types and mapping the column
   * properties.
   * @param {AnyObject} result - An array of objects representing the result of a database query. Each
   * object in the array should have the following properties:
   * @returns The function `generateColumnForTable` returns a promise that resolves to an array of
   * `ColumnForDataSourceModel` objects.
   */
  async generateColumnForTable(
    result: AnyObject,
  ): Promise<ColumnForDataSourceModel[]> {
    return Promise.all(
      result.map(
        async (row: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          column_name: string;
          // eslint-disable-next-line @typescript-eslint/naming-convention
          table_name: string;
          // eslint-disable-next-line @typescript-eslint/naming-convention
          data_type: string;
          // eslint-disable-next-line @typescript-eslint/naming-convention
          table_schema: string;
        }) => {
          const currRow: ColumnForDataSourceModel =
            {} as ColumnForDataSourceModel;
          currRow.columnName = row.column_name;
          currRow.dataSourceName = `${row.table_schema}.${row.table_name}`;
          currRow.displayName = row.column_name;
          currRow.originalDataType = row.data_type;
          currRow.dataType = row.data_type;

          return currRow;
        },
      ),
    );
  }
}
