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
  response,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {MetabaseToken} from '../models';
import {MetabaseTokenRepository} from '../repositories';

const basepath = '/metabase-tokens';
export class MetabaseTokenController {
  constructor(
    @repository(MetabaseTokenRepository)
    public metabaseTokenRepository: MetabaseTokenRepository,
  ) {}

  @post(basepath)
  @response(STATUS_CODE.OK, {
    description: 'MetabaseToken model instance',
    content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(MetabaseToken)}},
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(MetabaseToken, {
            title: 'NewMetabaseToken',
          }),
        },
      },
    })
    metabaseToken: MetabaseToken,
  ): Promise<MetabaseToken> {
    return this.metabaseTokenRepository.create(metabaseToken);
  }

  @get(`${basepath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'MetabaseToken model count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async count(
    @param.where(MetabaseToken) where?: Where<MetabaseToken>,
  ): Promise<Count> {
    return this.metabaseTokenRepository.count(where);
  }

  @get(basepath)
  @response(STATUS_CODE.OK, {
    description: 'Array of MetabaseToken model instances',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MetabaseToken, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MetabaseToken) filter?: Filter<MetabaseToken>,
  ): Promise<MetabaseToken[]> {
    return this.metabaseTokenRepository.find(filter);
  }

  @patch(basepath)
  @response(STATUS_CODE.OK, {
    description: 'MetabaseToken PATCH success count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(MetabaseToken, {partial: true}),
        },
      },
    })
    metabaseToken: MetabaseToken,
    @param.where(MetabaseToken) where?: Where<MetabaseToken>,
  ): Promise<Count> {
    return this.metabaseTokenRepository.updateAll(metabaseToken, where);
  }

  @get(`${basepath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'MetabaseToken model instance',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: getModelSchemaRef(MetabaseToken, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(MetabaseToken, {exclude: 'where'})
    filter?: FilterExcludingWhere<MetabaseToken>,
  ): Promise<MetabaseToken> {
    return this.metabaseTokenRepository.findById(id, filter);
  }

  @patch(`${basepath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'MetabaseToken PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(MetabaseToken, {partial: true}),
        },
      },
    })
    metabaseToken: MetabaseToken,
  ): Promise<void> {
    await this.metabaseTokenRepository.updateById(id, metabaseToken);
  }

  @put(`${basepath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'MetabaseToken PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() metabaseToken: MetabaseToken,
  ): Promise<void> {
    await this.metabaseTokenRepository.replaceById(id, metabaseToken);
  }

  @del(`${basepath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'MetabaseToken DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.metabaseTokenRepository.deleteById(id);
  }
}
