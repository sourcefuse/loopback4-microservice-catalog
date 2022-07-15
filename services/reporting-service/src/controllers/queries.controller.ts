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
import {Queries} from '../models';
import {QueriesRepository} from '../repositories';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';

const basepath = '/queries';
export class QueriesController {
  constructor(
    @repository(QueriesRepository)
    public queriesRepository: QueriesRepository,
  ) {}

  @post(basepath)
  @response(STATUS_CODE.OK, {
    description: 'Queries model instance',
    content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Queries)}},
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Queries, {
            title: 'NewQueries',
          }),
        },
      },
    })
    queries: Queries,
  ): Promise<Queries> {
    return this.queriesRepository.create(queries);
  }

  @get(`${basepath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'Queries model count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async count(@param.where(Queries) where?: Where<Queries>): Promise<Count> {
    return this.queriesRepository.count(where);
  }

  @get(basepath)
  @response(STATUS_CODE.OK, {
    description: 'Array of Queries model instances',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Queries, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Queries) filter?: Filter<Queries>,
  ): Promise<Queries[]> {
    return this.queriesRepository.find(filter);
  }

  @patch(basepath)
  @response(STATUS_CODE.OK, {
    description: 'Queries PATCH success count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Queries, {partial: true}),
        },
      },
    })
    queries: Queries,
    @param.where(Queries) where?: Where<Queries>,
  ): Promise<Count> {
    return this.queriesRepository.updateAll(queries, where);
  }

  @get(`${basepath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'Queries model instance',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: getModelSchemaRef(Queries, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Queries, {exclude: 'where'})
    filter?: FilterExcludingWhere<Queries>,
  ): Promise<Queries> {
    return this.queriesRepository.findById(id, filter);
  }

  @patch(`${basepath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Queries PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Queries, {partial: true}),
        },
      },
    })
    queries: Queries,
  ): Promise<void> {
    await this.queriesRepository.updateById(id, queries);
  }

  @put(`${basepath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Queries PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() queries: Queries,
  ): Promise<void> {
    await this.queriesRepository.replaceById(id, queries);
  }

  @del(`${basepath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Queries DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.queriesRepository.deleteById(id);
  }
}
