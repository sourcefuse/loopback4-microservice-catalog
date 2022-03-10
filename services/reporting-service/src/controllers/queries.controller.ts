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

export class QueriesController {
  constructor(
    @repository(QueriesRepository)
    public queriesRepository : QueriesRepository,
  ) {}

  @post('/queries')
  @response(200, {
    description: 'Queries model instance',
    content: {'application/json': {schema: getModelSchemaRef(Queries)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
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

  @get('/queries/count')
  @response(200, {
    description: 'Queries model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Queries) where?: Where<Queries>,
  ): Promise<Count> {
    return this.queriesRepository.count(where);
  }

  @get('/queries')
  @response(200, {
    description: 'Array of Queries model instances',
    content: {
      'application/json': {
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

  @patch('/queries')
  @response(200, {
    description: 'Queries PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Queries, {partial: true}),
        },
      },
    })
    queries: Queries,
    @param.where(Queries) where?: Where<Queries>,
  ): Promise<Count> {
    return this.queriesRepository.updateAll(queries, where);
  }

  @get('/queries/{id}')
  @response(200, {
    description: 'Queries model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Queries, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Queries, {exclude: 'where'}) filter?: FilterExcludingWhere<Queries>
  ): Promise<Queries> {
    return this.queriesRepository.findById(id, filter);
  }

  @patch('/queries/{id}')
  @response(204, {
    description: 'Queries PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Queries, {partial: true}),
        },
      },
    })
    queries: Queries,
  ): Promise<void> {
    await this.queriesRepository.updateById(id, queries);
  }

  @put('/queries/{id}')
  @response(204, {
    description: 'Queries PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() queries: Queries,
  ): Promise<void> {
    await this.queriesRepository.replaceById(id, queries);
  }

  @del('/queries/{id}')
  @response(204, {
    description: 'Queries DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.queriesRepository.deleteById(id);
  }
}
