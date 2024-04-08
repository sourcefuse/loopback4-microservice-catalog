import {AnyObject, Count, CountSchema, Filter} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {DataSet} from '../models';

import {service} from '@loopback/core';
import {PermissionKeys} from '../enums';
import {CustomFilter} from '../interfaces';
import {DataSetsService} from '../services/data-sets.service';
const DATASET_URL = '/data-sets/{id}';

/* The `DataSetsController` class is a TypeScript class that defines API endpoints for creating,
retrieving, updating, and deleting data sets, as well as fetching data from a data set. */
export class DataSetsController {
  constructor(
    @service(DataSetsService)
    private readonly dataSetsService: DataSetsService,
  ) {}
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.CreateDataSets],
  })
  @post('/data-sets', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'API to create a new DataSet',
        content: {[CONTENT_TYPE.JSON]: {schema: DataSet}},
      },
    },
  })
  /**
   * The create function accepts a dataSet object, excluding the id property, and returns a Promise
   * that resolves to a DataSet object.
   * @param dataSet - The `dataSet` parameter is an object of type `DataSet` with the `id` property
   * excluded. It represents the data that will be used to create a new data set.
   * @returns a Promise that resolves to a DataSet object.
   */
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(DataSet, {
            title: 'NewDataSet',
            exclude: ['id'],
          }),
        },
      },
    })
    dataSet: Omit<DataSet, 'id'>,
  ): Promise<DataSet> {
    return this.dataSetsService.createDataSet(dataSet);
  }
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.ViewDataSetsList],
  })
  @get('/data-sets/count', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'API to get the count of DataSets',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })

  /**
   * The function "count" returns the count of data sets based on the provided filter.
   * @param [filter] - The `filter` parameter is an optional parameter of type `Filter<DataSet>`. It is
   * used to specify the criteria for filtering the data sets. The `Filter` type is a generic type that
   * allows you to define the filter criteria based on the properties of the `DataSet` type.
   * @returns The `count` function is returning a `Promise` that resolves to a `Count` object.
   */
  async count(@param.filter(DataSet) filter?: Filter<DataSet>): Promise<Count> {
    return this.dataSetsService.getCount(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.ViewDataSetsList],
  })
  @get('/data-sets', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'API to get list of all data sets',
        content: {[CONTENT_TYPE.JSON]: {schema: DataSet}},
      },
    },
  })

  /**
   * The function `getDataSets` is an asynchronous function that retrieves all data sets based on an
   * optional filter parameter.
   * @param [filter] - The `filter` parameter is an optional parameter of type `Filter<DataSet>`. It is
   * used to specify a filter condition to apply when retrieving data sets. The `Filter` type is a
   * generic type that allows you to define the filter condition based on the properties of the
   * `DataSet` type.
   * @returns a Promise that resolves to an array of DataSet objects.
   */
  async getDataSets(
    @param.filter(DataSet) filter?: Filter<DataSet>,
  ): Promise<DataSet[]> {
    return this.dataSetsService.getAllDataSets(filter);
  }
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.ViewDataSets],
  })
  @get(DATASET_URL, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'API to fetch info for a particular data set based on ID',
        content: {[CONTENT_TYPE.JSON]: {schema: DataSet}},
      },
    },
  })

  /**
   * The function findById takes an id parameter and returns a Promise that resolves to a DataSet
   * object.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
   * dataset.
   * @returns a Promise that resolves to a DataSet object.
   */
  async findById(@param.path.string('id') id: string): Promise<DataSet> {
    return this.dataSetsService.getDataSetById(id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.DeleteDataSets],
  })
  @del(DATASET_URL, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Delete a given Data Set based on ID',
        content: {[CONTENT_TYPE.JSON]: {schema: DataSet}},
      },
    },
  })

  /**
   * The function deletes a data set by its ID.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
   * data set.
   * @returns a Promise that resolves to void.
   */
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    return this.dataSetsService.deleteDataSetById(id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.UpdateDataSets],
  })
  @patch(DATASET_URL, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'API to update Data Set based on ID',
        content: {[CONTENT_TYPE.JSON]: {schema: DataSet}},
      },
    },
  })

  /**
   * The function `updateById` updates a data set by its ID.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * dataset that needs to be updated.
   * @param {DataSet} dataSets - The `dataSets` parameter is an object of type `DataSet`. It is the
   * data that will be used to update a dataset in the database.
   * @returns a Promise that resolves to void.
   */
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(DataSet, {
            title: 'updateDataSet',
            partial: true,
          }),
        },
      },
    })
    dataSets: DataSet,
  ): Promise<void> {
    return this.dataSetsService.updateDataSetById(id, dataSets);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.FetchDataFromDataSet],
  })
  @get(`${DATASET_URL}/fetch-data`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'API to fetch data from a data set based on ID',
        content: {[CONTENT_TYPE.JSON]: {schema: DataSet}},
      },
    },
  })

  /**
   * The function `fetchDataById` fetches data by ID and applies a filter if provided.
   * @param {string} id - The `id` parameter is a string that represents the identifier of the data to
   * fetch. It is passed as a path parameter in the URL.
   * @param {string} [filterStr] - The `filterStr` parameter is an optional query parameter that allows
   * you to filter the data based on certain conditions. It is a string representation of a JSON object
   * that specifies the filter conditions.
   * @returns The function `fetchDataById` returns a Promise that resolves to an object of type
   * `AnyObject`.
   */
  async fetchDataById(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: CustomFilter<AnyObject>,
  ): Promise<AnyObject> {
    // Parse the filter string into an object that matches the structure of StructuredQueryInterface 'where' clause
    const effectiveFilter = filter ?? {};
    return this.dataSetsService.fetchDataById(id, effectiveFilter);
  }
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.FetchDataFromDataSet],
  })
  @get(`${DATASET_URL}/fetch-data/count`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'API to fetch count of data from a data set based on ID',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  /**
   * The function `fetchDataByIdCount` fetches the count of data by a specific ID, with an optional
   * filter.
   * @param {string} id - The `id` parameter is a string that represents the identifier of the data you
   * want to fetch. It is passed as a path parameter in the URL.
   * @param {string} [filterStr] - The `filterStr` parameter is a string that represents a filter
   * condition for the data query. It is an optional parameter, so it may or may not be provided when
   * calling the `fetchDataByIdCount` function. The purpose of this parameter is to allow the caller to
   * specify a filter condition to
   * @returns The function `fetchDataByIdCount` returns a Promise that resolves to a `Count` object.
   */
  async fetchDataByIdCount(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: CustomFilter<AnyObject>,
  ): Promise<Count> {
    const effectiveFilter = filter ?? {};
    return this.dataSetsService.fetchDataByIdCount(id, effectiveFilter);
  }
}
