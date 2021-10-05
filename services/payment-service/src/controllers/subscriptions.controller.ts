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
import {Subscriptions} from '../models';
import {STATUS_CODE} from '@sourceloop/core';
import {SubscriptionsRepository} from '../repositories';
const subscriptionsRoutePath = '/subscriptions';
const subscriptionsIdRoutePath = '/subscriptions/{id}';

export class SubscriptionsController {
  constructor(
    @repository(SubscriptionsRepository)
    public subscriptionsRepository: SubscriptionsRepository,
  ) {}

  @post(subscriptionsRoutePath)
  @response(STATUS_CODE.OK, {
    description: 'Subscriptions model instance',
    content: {'application/json': {schema: getModelSchemaRef(Subscriptions)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscriptions, {
            title: 'NewSubscriptions',
          }),
        },
      },
    })
    subscriptions: Subscriptions,
  ): Promise<Subscriptions> {
    return this.subscriptionsRepository.create(subscriptions);
  }

  @get('/subscriptions/count')
  @response(STATUS_CODE.OK, {
    description: 'Subscriptions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Subscriptions) where?: Where<Subscriptions>,
  ): Promise<Count> {
    return this.subscriptionsRepository.count(where);
  }

  @get(subscriptionsRoutePath)
  @response(STATUS_CODE.OK, {
    description: 'Array of Subscriptions model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Subscriptions, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Subscriptions) filter?: Filter<Subscriptions>,
  ): Promise<Subscriptions[]> {
    return this.subscriptionsRepository.find(filter);
  }

  @patch(subscriptionsRoutePath)
  @response(STATUS_CODE.OK, {
    description: 'Subscriptions PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscriptions, {partial: true}),
        },
      },
    })
    subscriptions: Subscriptions,
    @param.where(Subscriptions) where?: Where<Subscriptions>,
  ): Promise<Count> {
    return this.subscriptionsRepository.updateAll(subscriptions, where);
  }

  @get(subscriptionsIdRoutePath)
  @response(STATUS_CODE.OK, {
    description: 'Subscriptions model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Subscriptions, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Subscriptions, {exclude: 'where'})
    filter?: FilterExcludingWhere<Subscriptions>,
  ): Promise<Subscriptions> {
    return this.subscriptionsRepository.findById(id, filter);
  }

  @patch(subscriptionsIdRoutePath)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Subscriptions PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscriptions, {partial: true}),
        },
      },
    })
    subscriptions: Subscriptions,
  ): Promise<void> {
    await this.subscriptionsRepository.updateById(id, subscriptions);
  }

  @put(subscriptionsIdRoutePath)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Subscriptions PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subscriptions: Subscriptions,
  ): Promise<void> {
    await this.subscriptionsRepository.replaceById(id, subscriptions);
  }

  @del(subscriptionsIdRoutePath)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Subscriptions DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.subscriptionsRepository.deleteById(id);
  }
}
