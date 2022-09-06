// Copyright (c) 2022 Sourcefuse Technologies
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
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  requestBody,
  del,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums';
import {Feature} from '../models';
import {FeatureRepository} from '../repositories';

const basePath = '/features';
export class FeatureController {
  constructor(
    @repository(FeatureRepository)
    public featureRepository: FeatureRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateFeature, PermissionKey.CreateFeatureNum],
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Feature model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Feature)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Feature, {
            title: 'NewFeature',
          }),
        },
      },
    })
    feature: Feature,
  ): Promise<Feature> {
    return this.featureRepository.create(feature);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewFeature, PermissionKey.ViewFeatureNum],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Feature model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Feature) where?: Where<Feature>): Promise<Count> {
    return this.featureRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewFeature, PermissionKey.ViewFeatureNum],
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Feature model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Feature, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Feature) filter?: Filter<Feature>,
  ): Promise<Feature[]> {
    return this.featureRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateFeature, PermissionKey.UpdateFeatureNum],
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Feature PATCH success count',
        content: {
          [CONTENT_TYPE.JSON]: {schema: CountSchema},
        },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Feature, {partial: true}),
        },
      },
    })
    feature: Feature,
    @param.where(Feature) where?: Where<Feature>,
  ): Promise<Count> {
    return this.featureRepository.updateAll(feature, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewFeature, PermissionKey.ViewFeatureNum],
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Feature model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Feature, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Feature, {exclude: 'where'})
    filter?: FilterExcludingWhere<Feature>,
  ): Promise<Feature> {
    return this.featureRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateFeature, PermissionKey.UpdateFeatureNum],
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Feature PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Feature, {partial: true}),
        },
      },
    })
    feature: Feature,
  ): Promise<void> {
    await this.featureRepository.updateById(id, feature);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateFeature, PermissionKey.UpdateFeatureNum],
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Feature PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() feature: Feature,
  ): Promise<void> {
    await this.featureRepository.replaceById(id, feature);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.DeleteFeature, PermissionKey.DeleteFeatureNum],
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Feature DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.featureRepository.deleteById(id);
  }
}
