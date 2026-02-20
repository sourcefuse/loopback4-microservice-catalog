import {inject} from '@loopback/core';
import {Count, CountSchema} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {CONTENT_TYPE, getModelSchemaRefSF, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums';
import {ColumnForDataSourceModel, DataSourceList} from '../interfaces';
import {DataSourcesService} from '../services/data-sources.service';
/* The `DataSourcesController` class is a TypeScript class that handles HTTP requests related to data
sources, including retrieving the count of data sources, listing data sources, and retrieving
columns for a specific data source. */
export class DataSourcesController {
  constructor(
    @inject('services.DataSourcesService')
    private readonly dataSourcesService: DataSourcesService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.ViewDataSources],
  })
  @get('/data-sources/count', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'data sources model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })

  /**
   * The count function returns an object with the total count of data sources.
   * @returns an object of type `Count` which contains a property `count`. The value of `count` is
   * obtained by awaiting the result of the `getTotalDataSourceCount()` method of the
   * `dataSourcesService`.
   */
  async count(): Promise<Count> {
    return {count: await this.dataSourcesService.getTotalDataSourceCount()};
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.ViewDataSources],
  })
  @get('/data-sources', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'List of data-sources',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  dataSourceName: {type: 'string'},
                  displayName: {type: 'string'},
                },
              },
            },
          },
        },
      },
    },
  })

  /**
   * The function "find" asynchronously retrieves a list of data sources and returns it as a Promise.
   * @returns a Promise that resolves to an array of DataSourceList objects.
   */
  async find(): Promise<DataSourceList[]> {
    return this.dataSourcesService.listdataSources();
  }

  /* The code snippet is defining a GET endpoint `/data-sources/{id}` that retrieves a specific data
   source by its ID. */
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKeys.ViewDataSourcesColumns],
  })
  @get('data-sources/{dataSource}/columns', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'List of columns for the specified data source',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRefSF(ColumnForDataSourceModel),
            },
          },
        },
      },
    },
  })
  /**
   * The function `findBydataSourceName` retrieves a list of columns for a given data source and
   * returns it as an array of `ColumnForDataSourceModel` objects.
   * @param {string} dataSource - The `dataSource` parameter is a string that represents the name of
   * the data source. It is used to identify the specific data source for which you want to find the
   * columns.
   * @returns an array of objects of type `ColumnForDataSourceModel[]`.
   */
  async findBydataSourceName(
    @param.path.string('dataSource') dataSource: string,
  ): Promise<ColumnForDataSourceModel[]> {
    return this.dataSourcesService.listDataSourceColumns(dataSource);
  }
}
