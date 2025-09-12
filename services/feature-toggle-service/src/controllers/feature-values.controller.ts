// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums';
import {FeatureValues} from '../models';
import {FeatureValuesRepository} from '../repositories';

const basePath = '/feature-values';
export class FeatureValuesController {
  constructor(
    @repository(FeatureValuesRepository)
    public featureValuesRepository: FeatureValuesRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateFeatureValues,
      PermissionKey.CreateFeatureValuesNum,
    ],
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'FeatureValues model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(FeatureValues)},
        },
      },
    },
  })
  /**
   * This function creates a new instance of FeatureValues and returns it after saving it to the
   * database.
   * @param {FeatureValues} featureValues - The `featureValues` parameter in the `create` function is
   * of type `FeatureValues`. It is being passed as the request body and is used to create a new
   * instance of `FeatureValues` in the database using the `featureValuesRepository.create` method.
   * @returns The `create` method is returning a Promise that resolves to a `FeatureValues` object.
   */
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(FeatureValues, {
            title: 'NewFeatureValues',
          }),
        },
      },
    })
    featureValues: FeatureValues,
  ): Promise<FeatureValues> {
    return this.featureValuesRepository.create(featureValues);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewFeatureValues,
      PermissionKey.ViewFeatureValuesNum,
    ],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'FeatureValues model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(FeatureValues) where?: Where<FeatureValues>,
  ): Promise<Count> {
    return this.featureValuesRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewFeatureValues,
      PermissionKey.ViewFeatureValuesNum,
    ],
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of FeatureValues model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(FeatureValues, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(FeatureValues) filter?: Filter<FeatureValues>,
  ): Promise<FeatureValues[]> {
    return this.featureValuesRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateFeatureValues,
      PermissionKey.UpdateFeatureValuesNum,
    ],
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'FeatureValues PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(FeatureValues, {partial: true}),
        },
      },
    })
    featureValues: FeatureValues,
    @param.where(FeatureValues) where?: Where<FeatureValues>,
  ): Promise<Count> {
    return this.featureValuesRepository.updateAll(featureValues, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewFeatureValues,
      PermissionKey.ViewFeatureValuesNum,
    ],
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'FeatureValues model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(FeatureValues, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(FeatureValues, {exclude: 'where'})
    filter?: FilterExcludingWhere<FeatureValues>,
  ): Promise<FeatureValues> {
    return this.featureValuesRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateFeatureValues,
      PermissionKey.UpdateFeatureValuesNum,
    ],
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'FeatureValues PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(FeatureValues, {partial: true}),
        },
      },
    })
    featureValues: FeatureValues,
  ): Promise<void> {
    await this.featureValuesRepository.updateById(id, featureValues);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateFeatureValues,
      PermissionKey.UpdateFeatureValuesNum,
    ],
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'FeatureValues PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() featureValues: FeatureValues,
  ): Promise<void> {
    await this.featureValuesRepository.replaceById(id, featureValues);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.DeleteFeatureValues,
      PermissionKey.DeleteFeatureValuesNum,
    ],
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'FeatureValues DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.featureValuesRepository.deleteById(id);
  }
}
