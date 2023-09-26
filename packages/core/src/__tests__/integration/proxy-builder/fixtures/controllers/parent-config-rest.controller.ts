import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
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
  response,
} from '@loopback/rest';
import {ParentConfig} from '../models';
import {ParentConfigRepository} from '../repositories';

export class RestParentConfigController {
  constructor(
    @repository(ParentConfigRepository)
    public parentConfigRepo: ParentConfigRepository,
  ) {}

  @post('/rest-parent-configs')
  @response(200, {
    description: 'ParentConfig model instance',
    content: {'application/json': {schema: getModelSchemaRef(ParentConfig)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParentConfig, {
            title: 'NewConfig',
            exclude: ['id'],
          }),
        },
      },
    })
    config: Omit<ParentConfig, 'id'>,
  ): Promise<ParentConfig> {
    return this.parentConfigRepo.create(config);
  }

  @get('/rest-parent-configs/count')
  @response(200, {
    description: 'ParentConfig model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ParentConfig) where?: Where<ParentConfig>,
  ): Promise<Count> {
    return this.parentConfigRepo.count(where);
  }

  @get('/rest-parent-configs')
  @response(200, {
    description: 'Array of ParentConfig model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ParentConfig, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ParentConfig) filter?: Filter<ParentConfig>,
  ): Promise<ParentConfig[]> {
    return this.parentConfigRepo.find(filter);
  }

  @patch('/rest-parent-configs')
  @response(200, {
    description: 'ParentConfig PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParentConfig, {partial: true}),
        },
      },
    })
    config: ParentConfig,
    @param.where(ParentConfig) where?: Where<ParentConfig>,
  ): Promise<Count> {
    return this.parentConfigRepo.updateAll(config, where);
  }

  @get('/rest-parent-configs/{id}')
  @response(200, {
    description: 'ParentConfig model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ParentConfig, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ParentConfig, {exclude: 'where'})
    filter?: FilterExcludingWhere<ParentConfig>,
  ): Promise<ParentConfig> {
    return this.parentConfigRepo.findById(id, filter);
  }

  @patch('/rest-parent-configs/{id}')
  @response(204, {
    description: 'ParentConfig PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ParentConfig, {partial: true}),
        },
      },
    })
    config: ParentConfig,
  ): Promise<void> {
    await this.parentConfigRepo.updateById(id, config);
  }

  @put('/rest-parent-configs/{id}')
  @response(204, {
    description: 'ParentConfig PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() config: ParentConfig,
  ): Promise<void> {
    await this.parentConfigRepo.replaceById(id, config);
  }

  @del('/rest-parent-configs/{id}')
  @response(204, {
    description: 'ParentConfig DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.parentConfigRepo.deleteById(id);
  }
}
