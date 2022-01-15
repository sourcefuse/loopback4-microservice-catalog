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
import {Strategies} from '../models';
import {StrategiesRepository} from '../repositories';

const basePath = '/strategies';
export class StrategiesController {
  constructor(
    @repository(StrategiesRepository)
    public strategiesRepository: StrategiesRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Strategies model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Strategies)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Strategies, {
            title: 'NewStrategies',
          }),
        },
      },
    })
    strategies: Strategies,
  ): Promise<Strategies> {
    return this.strategiesRepository.create(strategies);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Strategies model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Strategies) where?: Where<Strategies>,
  ): Promise<Count> {
    return this.strategiesRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Strategies model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Strategies, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Strategies) filter?: Filter<Strategies>,
  ): Promise<Strategies[]> {
    return this.strategiesRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Strategies PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Strategies, {partial: true}),
        },
      },
    })
    strategies: Strategies,
    @param.where(Strategies) where?: Where<Strategies>,
  ): Promise<Count> {
    return this.strategiesRepository.updateAll(strategies, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Strategies model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Strategies, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Strategies, {exclude: 'where'})
    filter?: FilterExcludingWhere<Strategies>,
  ): Promise<Strategies> {
    return this.strategiesRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Strategies PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Strategies, {partial: true}),
        },
      },
    })
    strategies: Strategies,
  ): Promise<void> {
    await this.strategiesRepository.updateById(id, strategies);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Strategies PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() strategies: Strategies,
  ): Promise<void> {
    await this.strategiesRepository.replaceById(id, strategies);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Strategies DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.strategiesRepository.deleteById(id);
  }
}
