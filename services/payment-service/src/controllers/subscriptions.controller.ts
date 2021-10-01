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
import {SubscriptionsRepository} from '../repositories';

export class SubscriptionsController {
  constructor(
    @repository(SubscriptionsRepository)
    public subscriptionsRepository: SubscriptionsRepository,
  ) {}

  @post('/subscriptions')
  @response(200, {
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
  @response(200, {
    description: 'Subscriptions model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Subscriptions) where?: Where<Subscriptions>,
  ): Promise<Count> {
    return this.subscriptionsRepository.count(where);
  }

  @get('/subscriptions')
  @response(200, {
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

  @patch('/subscriptions')
  @response(200, {
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

  @get('/subscriptions/{id}')
  @response(200, {
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

  @patch('/subscriptions/{id}')
  @response(204, {
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

  @put('/subscriptions/{id}')
  @response(204, {
    description: 'Subscriptions PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subscriptions: Subscriptions,
  ): Promise<void> {
    await this.subscriptionsRepository.replaceById(id, subscriptions);
  }

  @del('/subscriptions/{id}')
  @response(204, {
    description: 'Subscriptions DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.subscriptionsRepository.deleteById(id);
  }
}
