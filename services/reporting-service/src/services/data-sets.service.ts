import {BindingScope, inject, injectable} from '@loopback/core';
import {AnyObject, Count, Filter, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';

import {ILogger, LOGGER} from '@sourceloop/core';
import * as CryptoJS from 'crypto-js';
import {
  ColumnEntityPair,
  CustomFilter,
  DataSetServiceConfig,
  DataStoreAdapter,
  FunctionExpression,
  QueryUtilityInterface,
  SqlValidatorInterface,
  StructuredQueryInterface,
} from '../interfaces';
import {ReportingServiceComponentBindings} from '../keys';
import {DataSet} from '../models';
import {DataSetsRepository} from '../repositories';
const BAD_REQUEST = 400;
const MINUS_TWO = -2;
@injectable({scope: BindingScope.TRANSIENT})
/* The `DataSetsService` class is responsible for creating, validating, updating, and retrieving data
sets, as well as fetching data from data sources based on specified queries. */
export class DataSetsService {
  config: DataSetServiceConfig;

  constructor(
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @repository(DataSetsRepository)
    private readonly dataSetsRepo: DataSetsRepository,
    @inject(ReportingServiceComponentBindings.DATA_STORE_ADAPTER)
    private readonly dataStoreAdapter: DataStoreAdapter,
    @inject(ReportingServiceComponentBindings.QUERY_UTILITY)
    private readonly queryUtility: QueryUtilityInterface,
    @inject(ReportingServiceComponentBindings.SQL_VALIDATOR, {optional: true})
    private readonly sqlValidator: SqlValidatorInterface,
    @inject(ReportingServiceComponentBindings.DATA_SET_CONFIG, {optional: true})
    config: DataSetServiceConfig = {},
  ) {
    this.config = config;
  }

  /**
   * The function creates a data set by validating it, generating a hash, checking for duplicates, and
   * then creating it in the repository.
   * @param {DataSet} dataSet - The `dataSet` parameter is an object that represents a dataset. It
   * contains various properties and values that describe the dataset.
   * @returns a Promise that resolves to a DataSet object.
   */
  async createDataSet(dataSet: DataSet): Promise<DataSet> {
    await this.validateDataSet(dataSet);

    const hashFields = this.config.hashFields ?? [];
    this.ensureValidHashFields(hashFields, dataSet);

    dataSet.dataSetQueryHash = this.generateHash(dataSet, hashFields);

    if (
      dataSet.dataSetQueryHash &&
      (await this.isDuplicate(dataSet.dataSetQueryHash))
    ) {
      throw new HttpErrors.BadRequest('Duplicate dataSet');
    }

    return this.dataSetsRepo.create(dataSet);
  }

  /**
   * The function `validateDataSet` in TypeScript validates a DataSet object by checking for query or
   * SQL, validating query syntax and data sources, and validating SQL using a SQL validator if
   * available.
   * @param {DataSet} dataSet - The `dataSet` parameter is an object that contains information about a
   * data set, including `dataSetQuery` and `dataSetQuerySQL` properties. The `validateDataSet`
   * function is responsible for validating these properties. If `dataSetQuery` is present, it will be
   * validated using the
   * @returns If neither `dataSetQuery` nor `dataSetQuerySQL` is found in the `dataSet`, the function
   * returns without performing any validation.
   */
  private async validateDataSet(dataSet: DataSet) {
    if (!dataSet.dataSetQuery && !dataSet.dataSetQuerySQL) {
      this.logger.info('No DataSet query or SQL found to validate.');
      return;
    }
    if (dataSet.dataSetQuery) {
      await Promise.all([
        this.validateDataSetQuery(dataSet.dataSetQuery),
        this.validateDataSourcesAndColumns(dataSet.dataSetQuery),
      ]);
    }
    if (dataSet.dataSetQuerySQL) {
      if (!this.sqlValidator) {
        this.logger.info(
          'No SQL Validator attached, the SQL validation shall be skipped.',
        );
        return;
      }

      const isValid = await this.sqlValidator.validate(dataSet.dataSetQuerySQL);
      if (!isValid) {
        throw new Error(
          'The Data Set SQL Query is invalid. Please check the syntax and references.',
        );
      }
    }
  }

  /**
   * The function generates a hash value based on the specified fields of a given data set using the
   * SHA256 algorithm.
   * @param {DataSet} dataSet - The `dataSet` parameter is an object of type `DataSet`. It contains the
   * data that needs to be hashed.
   * @param {string[]} fields - An array of strings representing the fields in the dataSet object that
   * you want to include in the hash calculation.
   * @returns a string value or undefined.
   */
  private generateHash(dataSet: DataSet, fields: string[]): string | undefined {
    if (fields.length === 0) return undefined;

    const hashData = fields.reduce(
      (acc: {[key: string]: AnyObject}, field) => {
        const value = (dataSet as AnyObject)[field];
        if (value !== undefined) {
          acc[field] = value;
        }
        return acc;
      },
      {} as {[key: string]: AnyObject},
    );

    return CryptoJS.SHA256(JSON.stringify(hashData)).toString(CryptoJS.enc.Hex);
  }

  /**
   * The function checks if there is a duplicate data set with the given hash, excluding the data set
   * with the provided ID if specified.
   * @param {string} hash - The `hash` parameter is a string that represents a unique identifier for a
   * dataset. It is used to check if there is already an existing dataset with the same hash value.
   * @param {string} [excludeId] - The `excludeId` parameter is an optional parameter that allows you
   * to exclude a specific ID from the duplicate check. If you provide a value for `excludeId`, the
   * function will check for duplicates excluding the dataset with that ID. If `excludeId` is not
   * provided, the function will check for
   * @returns a Promise that resolves to a boolean value.
   */
  private async isDuplicate(
    hash: string,
    excludeId?: string,
  ): Promise<boolean> {
    const whereCondition: AnyObject = {dataSetQueryHash: hash};

    if (excludeId) {
      whereCondition.id = {neq: excludeId}; // Add the ID check only if excludeId is provided
    }

    const existingDataSet = await this.dataSetsRepo.findOne({
      where: whereCondition,
    });

    return !!existingDataSet;
  }

  /**
   * The function ensures that all fields in an array exist in a given data set, otherwise it throws a
   * BadRequest error.
   * @param {string[]} fields - An array of strings representing the fields that need to be validated
   * in the dataSet.
   * @param {DataSet} dataSet - The `dataSet` parameter is an object that represents a set of data. It
   * could be any JavaScript object that contains key-value pairs.
   */
  private ensureValidHashFields(fields: string[], dataSet: DataSet): void {
    fields.forEach(field => {
      if (!(field in dataSet)) {
        throw new HttpErrors.BadRequest(`Invalid hash field: ${field}`);
      }
    });
  }

  /**
   * The function `getDataSetById` retrieves a dataset by its ID from a repository.
   * @param {string} id - A string representing the ID of the dataset that you want to retrieve.
   * @returns a Promise that resolves to a DataSet object.
   */
  async getDataSetById(id: string): Promise<DataSet> {
    return this.dataSetsRepo.findById(id);
  }

  /**
   * The function `getAllDataSets` returns a promise that resolves to an array of `DataSet` objects,
   * filtered by an optional `Filter` parameter.
   * @param [filter] - The `filter` parameter is an optional parameter of type `Filter<DataSet>`. It is
   * used to specify the criteria for filtering the data sets that will be returned. The `Filter` type
   * is a generic type that allows you to define the properties and their types that can be used for
   * filtering.
   * @returns a Promise that resolves to an array of DataSet objects.
   */
  async getAllDataSets(filter?: Filter<DataSet>): Promise<DataSet[]> {
    return this.dataSetsRepo.find(filter);
  }

  /**
   * The function deletes a data set by its ID.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * dataset that needs to be deleted.
   */
  async deleteDataSetById(id: string): Promise<void> {
    await this.dataSetsRepo.deleteById(id);
  }

  /**
   * The function updates a dataset by validating it, generating a hash for the updated dataset,
   * checking for duplicates, and then updating the dataset in the repository.
   * @param {string} id - A string representing the ID of the dataset to be updated.
   * @param {DataSet} dataSet - The `dataSet` parameter is an object that represents the updated
   * dataset. It contains the new values for the dataset fields that need to be updated.
   */
  async updateDataSetById(id: string, dataSet: DataSet): Promise<void> {
    await this.validateDataSet(dataSet);

    // Generate hash for the updated dataset
    const hashFields = this.config.hashFields ?? [];
    this.ensureValidHashFields(hashFields, dataSet);
    const updatedHash = this.generateHash(dataSet, hashFields);

    if (updatedHash) {
      // Check if the updated dataset would cause a duplicate
      const duplicate = await this.isDuplicate(updatedHash, id);
      if (duplicate) {
        throw new HttpErrors.BadRequest(
          'Update would cause a duplicate dataSet',
        );
      }
    }

    // Update the dataset
    await this.dataSetsRepo.updateById(id, dataSet);
  }

  /**
   * The function `getCount` returns the count of data sets based on an optional filter.
   * @param [filter] - The `filter` parameter is an optional parameter of type `Filter<DataSet>`. It is
   * used to specify conditions for filtering the data sets. The `Filter` type is a generic type that
   * allows you to define the structure of the filter object. In this case, it is specifically defined
   * for filtering
   * @returns The `getCount` function returns a Promise that resolves to a `Count` object.
   */
  async getCount(filter?: Filter<DataSet>): Promise<Count> {
    return this.dataSetsRepo.count(filter?.where);
  }

  /**
   * The function validates a data set query object and throws an error if it is invalid.
   * @param {StructuredQueryInterface} dataSetQuery - The `dataSetQuery` parameter is of type
   * `StructuredQueryInterface`.
   */
  private async validateDataSetQuery(dataSetQuery: StructuredQueryInterface) {
    const isValidObject = this.queryUtility.validateQueryObject(dataSetQuery);
    if (!isValidObject) {
      throw HttpErrors(BAD_REQUEST, 'Invalid dataSetQuery');
    }
  }

  /**
   * The function validates the data sources and columns in a given data set query.
   * @param {StructuredQueryInterface} dataSetQuery - The `dataSetQuery` parameter is of type
   * `StructuredQueryInterface`. It represents a structured query object that contains information
   * about the data sources and columns to be validated.
   */
  private async validateDataSourcesAndColumns(
    dataSetQuery: StructuredQueryInterface,
  ) {
    const requestedDataSources = this.queryUtility.listAllDataSourcesFromJson(
      dataSetQuery,
      true,
    );

    const dataSourceExists =
      await this.dataStoreAdapter.checkIfDataSourceExists(requestedDataSources);
    if (!dataSourceExists) {
      throw HttpErrors(BAD_REQUEST, 'Invalid dataSources');
    }

    const columnEntityPairs = this.getColumnEntityPairs(dataSetQuery.select);
    const columnsExist =
      await this.dataStoreAdapter.checkIfColumnsExists(columnEntityPairs);

    if (!columnsExist) {
      throw HttpErrors(BAD_REQUEST, 'Invalid columns');
    }
  }

  /**
   * The function `getColumnEntityPairs` processes fields and functions from a select query to extract
   * column and entity pairs.
   * @param select - The `select` parameter in the `getColumnEntityPairs` function is of type
   * `StructuredQueryInterface['select']`. This means it is expected to be a part of a structured query
   * interface and specifically the `select` property of that interface. The function processes the
   * fields and functions within the `select
   * @returns The function `getColumnEntityPairs` returns an array of objects, where each object
   * represents a pair of a data source name and a column name extracted from the provided `select`
   * object.
   */
  private getColumnEntityPairs(
    select: StructuredQueryInterface['select'],
  ): ColumnEntityPair[] {
    const columnEntityPairs: ColumnEntityPair[] = [];

    select.fields?.forEach(field => {
      let fieldName: string | undefined;

      if (typeof field === 'string') {
        fieldName = field;
      } else if ('field' in field && typeof field.field === 'string') {
        fieldName = field.field;
      } else {
        // No operation for now, but you can handle other cases or log a warning if needed
      }

      if (fieldName) {
        const [dataSourceName, column] = fieldName.split('.').slice(MINUS_TWO);
        if (dataSourceName && column) {
          columnEntityPairs.push({dataSourceName, column});
        }
      }
    });

    select.functions?.forEach(func => {
      func.args.forEach(arg => {
        if (typeof arg === 'string') {
          const [dataSourceName, column] = arg.split('.').slice(MINUS_TWO);
          if (dataSourceName && column) {
            columnEntityPairs.push({dataSourceName, column});
          }
        }
      });
    });

    return columnEntityPairs;
  }

  /**
   * This TypeScript function fetches data by a specific ID using a custom filter and returns the
   * result as a Promise.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * data you want to fetch.
   * @param filter - The `filter` parameter in the `fetchDataById` function is of type
   * `CustomFilter<AnyObject>`. This means that it is a custom filter object that can be applied to
   * filter the data based on certain criteria. The `AnyObject` type indicates that the filter can be
   * applied to any
   * @returns The `fetchDataById` function returns a Promise that resolves to an object of type
   * `AnyObject`.
   */
  async fetchDataById(
    id: string,
    filter: CustomFilter<AnyObject>,
  ): Promise<AnyObject> {
    const query = await this.mergeAndValidateDataSetQuery(id, filter);
    //execute query

    return this.dataStoreAdapter.query(query);
  }

  /**
   * The function `fetchDataByIdCount` fetches the count of records based on a given ID and custom
   * filter.
   * @param {string} id - The `id` parameter in the `fetchDataByIdCount` function is a string that
   * represents the identifier used to fetch data from a data set. It is used to uniquely identify the
   * data set for which the count of records needs to be retrieved.
   * @param filter - The `filter` parameter in the `fetchDataByIdCount` function is of type
   * `CustomFilter<AnyObject>`. This means that it is a custom filter object that can be applied to
   * filter the data based on certain criteria. The `AnyObject` type indicates that the filter can be
   * applied to
   * @returns The function `fetchDataByIdCount` returns a Promise that resolves to an object containing
   * the count of records based on the provided id and filter. If the query is successful and there are
   * results, it returns an object with the count value. If there are no results, it returns an object
   * with a count of 0.
   */
  async fetchDataByIdCount(
    id: string,
    filter: CustomFilter<AnyObject>,
  ): Promise<Count> {
    const query = await this.mergeAndValidateDataSetQuery(id, filter);
    let countQuery: string | StructuredQueryInterface;

    if (typeof query === 'string') {
      // Convert the SQL query to a count query
      countQuery = this.convertToCountQuery(query);
    } else {
      // Define a count field expression using the FunctionExpression interface
      const countField: FunctionExpression = {
        function: 'COUNT',
        args: ['*'], // Count all records
        alias: 'count',
      };

      // Set the count field expression in the select fields

      countQuery = {
        ...query,
        select: {fields: [countField]},
      };

      // Remove properties not relevant for a count query
      delete countQuery.offset;
      delete countQuery.limit;
      delete countQuery.orderBy;
    }
    // Execute SQL query and process the result
    const result = await this.dataStoreAdapter.query(countQuery);
    if (result && result.length > 0) {
      const count = parseInt(result[0].count, 10);
      return {count};
    }

    return {count: 0};
  }

  /**
   * The function `convertToCountQuery` converts a SQL query to a count query by adding `SELECT
   * COUNT(*) AS count` before the FROM clause.
   * @param {string} sqlQuery - The `sqlQuery` parameter is a string representing a SQL query that you
   * want to convert into a count query. The function `convertToCountQuery` takes this SQL query as
   * input and converts it into a count query by prepending `SELECT COUNT(*) AS count` to the original
   * query after the
   * @returns The function `convertToCountQuery` takes a SQL query as input, extracts everything after
   * the `FROM` clause, and prepends it with `SELECT COUNT(*) AS count`. The modified query with the
   * count is then returned.
   */
  private convertToCountQuery(sqlQuery: string): string {
    // Basic conversion to a count query, might need adjustments based on your SQL dialect
    const fromIndex = sqlQuery.toUpperCase().indexOf('FROM');
    if (fromIndex === -1) {
      throw new Error('Invalid SQL Query for Count Conversion');
    }

    // Extract everything after the FROM clause and prepend with SELECT COUNT(*)
    const fromClauseAndAfter = sqlQuery.substring(fromIndex);
    return `SELECT COUNT(*) AS count ${fromClauseAndAfter}`;
  }

  /**
   * This function merges and validates a data set query based on the provided filter and dataset
   * information.
   * @param {string} id - The `id` parameter in the `mergeAndValidateDataSetQuery` function is a string
   * that represents the identifier of a dataset.
   * @param filter - The `filter` parameter in the `mergeAndValidateDataSetQuery` function is of type
   * `CustomFilter<AnyObject>`. This means it is a custom filter object that can filter data based on
   * certain criteria. The `AnyObject` type indicates that the filter can be applied to any type of
   * object
   * @returns The `mergeAndValidateDataSetQuery` function returns either a `StructuredQueryInterface`
   * object or a string.
   */
  private async mergeAndValidateDataSetQuery(
    id: string,
    filter: CustomFilter<AnyObject>,
  ): Promise<StructuredQueryInterface | string> {
    const datasetObj = await this.dataSetsRepo.findById(id);
    if (!datasetObj) {
      throw new HttpErrors.NotFound('Data set not found');
    }
    const {dataSetQuerySQL, dataSetQuery} = datasetObj;
    if (typeof dataSetQuerySQL === 'string') {
      return this.queryUtility.prepareFinalSqlQuery(dataSetQuerySQL, filter);
    }
    const query: StructuredQueryInterface = JSON.parse(
      JSON.stringify(dataSetQuery ?? {}),
    );
    if (filter.where) {
      query.where = query.where
        ? {and: [query.where, filter.where]}
        : filter.where;
    }
    if (filter.order) {
      query.orderBy = this.convertOrderToOrderBy(filter.order);
    }
    query.limit = filter.limit ?? query.limit;
    query.offset = filter.offset ?? query.offset;

    const isValidObject = this.queryUtility.validateQueryObject(query);
    if (!isValidObject) {
      throw new HttpErrors.BadRequest('Invalid data set query');
    }

    return query;
  }

  /**
   * The function `convertOrderToOrderBy` converts an array of strings representing order criteria into
   * an array of objects with field and order properties.
   * @param {string[]} [orderArray] - The `orderArray` parameter is an optional array of strings that
   * represents the order in which to sort query results. Each string in the array consists of a field
   * name followed by a space and then the sorting order ('ASC' for ascending or 'DESC' for
   * descending).
   * @returns An array of objects with each object containing a "field" key and an "order" key with
   * values of either 'ASC' or 'DESC'.
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
}
