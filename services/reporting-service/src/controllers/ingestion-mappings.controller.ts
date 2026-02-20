import {inject} from '@loopback/core';
import {Count, CountSchema} from '@loopback/repository';
import {del, get, param, patch, post, requestBody} from '@loopback/rest';
import {CONTENT_TYPE, getModelSchemaRefSF, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums';
import {IngestionMapping as ingestionMappingsModel} from '../models';
import {IngestionMappingsService} from '../services';
const INGESTION_URL = '/ingestion-mapping/{dataSource}';

/* The `IngestionMappingsController` class is a TypeScript controller that handles CRUD operations for
ingestion mappings. */
export class IngestionMappingsController {
  constructor(
    @inject('services.IngestionMappingsService')
    private readonly ingestionMappingsService: IngestionMappingsService,
  ) {}

  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.ViewIngestionMappings]})
  @get('/ingestion-mapping/count', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Ingestion mapping model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })

  /**
   * The `count` function returns a promise that resolves to the count of ingestion mappings.
   * @returns The `count()` function is returning a `Promise` that resolves to a `Count` object.
   */
  async count(): Promise<Count> {
    return this.ingestionMappingsService.getCount();
  }

  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.CreateIngestionMappings]})
  @post('/ingestion-mapping', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Create a new mapping for data ingestion',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(ingestionMappingsModel),
          },
        },
      },
    },
  })

  /**
   * The create function accepts an ingestionMappingsModel object as a request body and returns a
   * Promise that resolves to the created ingestionMappingsModel object.
   * @param {ingestionMappingsModel} ingestionMappings - The `ingestionMappings` parameter is an object
   * of type `ingestionMappingsModel`. It is passed as the request body and contains the data that will
   * be used to create a new ingestion mapping.
   * @returns a Promise that resolves to an object of type ingestionMappingsModel.
   */
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(ingestionMappingsModel),
        },
      },
    })
    ingestionMappings: ingestionMappingsModel,
  ): Promise<ingestionMappingsModel> {
    return this.ingestionMappingsService.create(ingestionMappings);
  }

  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.ViewIngestionMappings]})
  @get('/ingestion-mapping', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Get a list of mapping for data ingestion',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(ingestionMappingsModel),
          },
        },
      },
    },
  })

  /**
   * The function "getAll" returns a promise that resolves to an array of "ingestionMappingsModel"
   * objects.
   * @returns The function `getAll()` is returning a Promise that resolves to an array of
   * `ingestionMappingsModel` objects.
   */
  async getAll(): Promise<ingestionMappingsModel[]> {
    return this.ingestionMappingsService.getAll();
  }

  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.UpdateIngestionMappings]})
  @patch(INGESTION_URL, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Update a mapping for data ingestion',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(ingestionMappingsModel),
          },
        },
      },
    },
  })

  /**
   * The `update` function in TypeScript updates the ingestion mappings for a given data source.
   * @param {string} dataSource - A string parameter that represents the data source. It is passed as a
   * path parameter in the URL.
   * @param {ingestionMappingsModel} ingestionMappings - The `ingestionMappings` parameter is an object
   * of type `ingestionMappingsModel`. It is used to pass the updated ingestion mappings data to the
   * `update` method.
   * @returns a Promise that resolves to void.
   */
  async update(
    @param.path.string('dataSource') dataSource: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(ingestionMappingsModel, {partial: true}),
        },
      },
    })
    ingestionMappings: ingestionMappingsModel,
  ): Promise<void> {
    return this.ingestionMappingsService.update(dataSource, ingestionMappings);
  }

  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.ViewIngestionMapping]})
  @get(INGESTION_URL, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Get a mapping for data ingestion',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(ingestionMappingsModel),
          },
        },
      },
    },
  })

  /**
   * The above function is an asynchronous method that takes a string parameter called "dataSource" and
   * returns a Promise that resolves to an object of type "ingestionMappingsModel".
   * @param {string} dataSource - The `dataSource` parameter is a string that represents the name of
   * the data source.
   * @returns a Promise that resolves to an object of type ingestionMappingsModel.
   */
  async get(
    @param.path.string('dataSource') dataSource: string,
  ): Promise<ingestionMappingsModel> {
    return this.ingestionMappingsService.getByName(dataSource);
  }

  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.DeleteIngestionMappings]})
  @del(INGESTION_URL, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Delete a mapping for data ingestion',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(ingestionMappingsModel),
          },
        },
      },
    },
  })

  /**
   * The `delete` function in TypeScript deletes an ingestion mapping by its data source name.
   * @param {string} dataSource - The `dataSource` parameter is a string that represents the name of
   * the data source to be deleted.
   * @returns The delete function is returning a Promise that resolves to void.
   */
  async delete(
    @param.path.string('dataSource') dataSource: string,
  ): Promise<void> {
    return this.ingestionMappingsService.deleteByName(dataSource);
  }
}
