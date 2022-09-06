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
  del,
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
import {FeatureToggle} from '../models';
import {FeatureToggleRepository} from '../repositories';

const basePath = '/featuretoggles';
export class FeatureToggleController {
  constructor(
    @repository(FeatureToggleRepository)
    public featureToggleRepository: FeatureToggleRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateFeatureToggle,
      PermissionKey.CreateFeatureToggleNum,
    ],
  })
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'FeatureToggle model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(FeatureToggle)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(FeatureToggle, {
            title: 'NewFeatureToggle',
          }),
        },
      },
    })
    featureToggle: FeatureToggle,
  ): Promise<FeatureToggle> {
    return this.featureToggleRepository.create(featureToggle);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewFeatureToggle,
      PermissionKey.ViewFeatureToggleNum,
    ],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'FeatureToggle model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(FeatureToggle) where?: Where<FeatureToggle>,
  ): Promise<Count> {
    return this.featureToggleRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewFeatureToggle,
      PermissionKey.ViewFeatureToggleNum,
    ],
  })
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of FeatureToggle model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(FeatureToggle, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(FeatureToggle) filter?: Filter<FeatureToggle>,
  ): Promise<FeatureToggle[]> {
    return this.featureToggleRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateFeatureToggle,
      PermissionKey.UpdateFeatureToggleNum,
    ],
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'FeatureToggle PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(FeatureToggle, {partial: true}),
        },
      },
    })
    featureToggle: FeatureToggle,
    @param.where(FeatureToggle) where?: Where<FeatureToggle>,
  ): Promise<Count> {
    return this.featureToggleRepository.updateAll(featureToggle, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewFeatureToggle,
      PermissionKey.ViewFeatureToggleNum,
    ],
  })
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'FeatureToggle model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(FeatureToggle, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(FeatureToggle, {exclude: 'where'})
    filter?: FilterExcludingWhere<FeatureToggle>,
  ): Promise<FeatureToggle> {
    return this.featureToggleRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateFeatureToggle,
      PermissionKey.UpdateFeatureToggleNum,
    ],
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'FeatureToggle PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(FeatureToggle, {partial: true}),
        },
      },
    })
    featureToggle: FeatureToggle,
  ): Promise<void> {
    await this.featureToggleRepository.updateById(id, featureToggle);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateFeatureToggle,
      PermissionKey.UpdateFeatureToggleNum,
    ],
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'FeatureToggle PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() featureToggle: FeatureToggle,
  ): Promise<void> {
    await this.featureToggleRepository.replaceById(id, featureToggle);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.DeleteFeatureToggle,
      PermissionKey.DeleteFeatureToggleNum,
    ],
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'FeatureToggle DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.featureToggleRepository.deleteById(id);
  }
}
