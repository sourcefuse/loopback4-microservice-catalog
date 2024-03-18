import {BindingScope, inject, injectable} from '@loopback/core';
import {AnyObject, Count, Filter, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';

import * as CryptoJS from 'crypto-js';
import {
  ColumnEntityPair,
  CustomFilter,
  DataSetServiceConfig,
  DataStoreAdapter,
  QueryUtilityInterface,
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
    @repository(DataSetsRepository)
    private readonly dataSetsRepo: DataSetsRepository,
    @inject(ReportingServiceComponentBindings.DATA_STORE_ADAPTER)
    private dataStoreAdapter: DataStoreAdapter,
    @inject(ReportingServiceComponentBindings.QUERY_UTILITY)
    private queryUtility: QueryUtilityInterface,
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
   * The function "validateDataSet" asynchronously validates a given data set by validating its query
   * and its data sources and columns.
   * @param {DataSet} dataSet - The `dataSet` parameter is an object that represents a data set. It
   * likely contains properties such as `dataSetQuery`, which represents the query used to retrieve the
   * data, and `dataSourcesAndColumns`, which represents the data sources and columns used in the
   * query.
   */
  private async validateDataSet(dataSet: DataSet) {
    await this.validateDataSetQuery(dataSet.dataSetQuery);

    await this.validateDataSourcesAndColumns(dataSet.dataSetQuery);
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

    const columnEntityPairs = this.getcolumnEntityPairs(dataSetQuery.select);

    const columnsExist =
      await this.dataStoreAdapter.checkIfColumnsExists(columnEntityPairs);

    if (!columnsExist) {
      throw HttpErrors(BAD_REQUEST, 'Invalid columns');
    }
  }

  /**
   * The function `getcolumnEntityPairs` takes a `select` object and returns an array of
   * `ColumnEntityPair` objects by extracting the data source name and column from each field or
   * function in the `select` object.
   * @param select - The `select` parameter is an object that represents the select clause of a
   * structured query. It contains two properties:
   * @returns an array of objects, where each object represents a column-entity pair.
   */
  private getcolumnEntityPairs(
    select: StructuredQueryInterface['select'],
  ): ColumnEntityPair[] {
    const {fields, functions = []} = select;
    const columnEntityPairs: ColumnEntityPair[] = [];

    [...fields, ...functions].forEach(item => {
      const isFieldObject = typeof item === 'object';
      const field = isFieldObject ? item.field : item;

      const [dataSourceName, column] = field.split('.').slice(MINUS_TWO);
      columnEntityPairs.push({dataSourceName, column});
    });

    return columnEntityPairs;
  }

  /**
   * The function fetchDataById fetches data from a data source based on an ID and a where clause.
   * @param {string} id - The `id` parameter is a string that represents the identifier of the data you
   * want to fetch. It is used to specify which data you want to retrieve from the data source.
   * @param whereClause - The `whereClause` parameter is a structured query interface that specifies
   * the conditions for filtering the data. It allows you to define conditions such as equality,
   * inequality, range, and logical operators to retrieve specific data from a dataset.
   * @returns The function `fetchDataById` is returning a Promise that resolves to an `AnyObject`.
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
   * The function fetches the count of records based on the provided id and where clause.
   * @param {string} id - The `id` parameter is a string that represents the identifier of the data you
   * want to fetch. It is used to specify which data set you want to query.
   * @param whereClause - The `whereClause` parameter is a structured query interface that specifies
   * the conditions for filtering the data. It allows you to define conditions such as equality,
   * inequality, range, and logical operators to filter the data based on specific criteria.
   * @returns a Promise that resolves to a Count object.
   */
  async fetchDataByIdCount(
    id: string,
    filter: CustomFilter<AnyObject>,
  ): Promise<Count> {
    const query = await this.mergeAndValidateDataSetQuery(id, filter);
    query.select.fields = [`COUNT(${query.from.dataSources[0]}.*) AS count`];
    delete query.offset;
    delete query.limit;
    delete query.orderBy;

    // Execute SQL query and process the result
    const result = await this.dataStoreAdapter.query(query);
    if (result && result.length > 0) {
      const count = parseInt(result[0].count, 10);
      return {count};
    }

    return {count: 0};
  }
  /**
   * The function merges and validates a data set query, throwing errors if the data set is not found
   * or the query is invalid.
   * @param {string} id - The `id` parameter is a string that represents the identifier of a data set.
   * It is used to retrieve the data set object from the dataSetsRepo.
   * @param whereClause - The `whereClause` parameter is a structured query interface that specifies
   * the conditions for filtering the data set. It is used to narrow down the results based on specific
   * criteria.
   * @returns a Promise that resolves to a StructuredQueryInterface object.
   */
  private async mergeAndValidateDataSetQuery(
    id: string,
    filter: CustomFilter<AnyObject>,
  ): Promise<StructuredQueryInterface> {
    const datasetObj = await this.dataSetsRepo.findById(id);
    if (!datasetObj) {
      throw new HttpErrors.NotFound('Data set not found');
    }

    // Set orderBy, limit, and offset with precedence to filter values
    let orderBy;
    if (filter?.order) {
      orderBy = this.convertOrderToOrderBy(filter.order);
    } else if (datasetObj.dataSetQuery?.orderBy) {
      orderBy = datasetObj.dataSetQuery.orderBy;
    } else {
      //no case for order by
    }
    const limit = filter?.limit ?? datasetObj.dataSetQuery?.limit;
    const offset = filter?.offset ?? datasetObj.dataSetQuery?.offset;

    const query: StructuredQueryInterface = {
      ...datasetObj.dataSetQuery,
      orderBy: orderBy,
      limit: limit,
      offset: offset,
    };
    // to be done in future releases check if current user has permission to access the data set
    // if not throw error
    // else fetch data from data set

    //validate data set query
    const isValidObject = this.queryUtility.validateQueryObject(query);

    if (!isValidObject) {
      throw new HttpErrors.BadRequest('Invalid data set query');
    }
    return query;
  }
  /**
   * The function converts an array of order strings into an array of structured query order objects.
   * @param {string[]} orderArray - An array of strings representing the order of fields in a query.
   * Each string in the array follows the format "field order", where "field" is the name of the field
   * and "order" is either "asc" for ascending order or "desc" for descending order.
   * @returns an array of objects that represent the order by clauses for a structured query. Each
   * object has two properties: "field" which represents the field to order by, and "order" which
   * represents the order direction ('asc' for ascending or 'desc' for descending).
   */
  convertOrderToOrderBy(
    orderArray: string[],
  ): StructuredQueryInterface['orderBy'] {
    return orderArray.map(orderStr => {
      const [field, ord] = orderStr.split(' ');
      return {field, order: ord.toLowerCase() as 'asc' | 'desc'};
    });
  }
}
