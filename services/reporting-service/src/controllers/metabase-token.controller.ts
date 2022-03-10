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
import {MetabaseToken} from '../models';
import {MetabaseTokenRepository} from '../repositories';

export class MetabaseTokenController {
  constructor(
    @repository(MetabaseTokenRepository)
    public metabaseTokenRepository : MetabaseTokenRepository,
  ) {}

  @post('/metabase-tokens')
  @response(200, {
    description: 'MetabaseToken model instance',
    content: {'application/json': {schema: getModelSchemaRef(MetabaseToken)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
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

  @get('/metabase-tokens/count')
  @response(200, {
    description: 'MetabaseToken model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MetabaseToken) where?: Where<MetabaseToken>,
  ): Promise<Count> {
    return this.metabaseTokenRepository.count(where);
  }

  @get('/metabase-tokens')
  @response(200, {
    description: 'Array of MetabaseToken model instances',
    content: {
      'application/json': {
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

  @patch('/metabase-tokens')
  @response(200, {
    description: 'MetabaseToken PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MetabaseToken, {partial: true}),
        },
      },
    })
    metabaseToken: MetabaseToken,
    @param.where(MetabaseToken) where?: Where<MetabaseToken>,
  ): Promise<Count> {
    return this.metabaseTokenRepository.updateAll(metabaseToken, where);
  }

  @get('/metabase-tokens/{id}')
  @response(200, {
    description: 'MetabaseToken model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MetabaseToken, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(MetabaseToken, {exclude: 'where'}) filter?: FilterExcludingWhere<MetabaseToken>
  ): Promise<MetabaseToken> {
    return this.metabaseTokenRepository.findById(id, filter);
  }

  @patch('/metabase-tokens/{id}')
  @response(204, {
    description: 'MetabaseToken PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MetabaseToken, {partial: true}),
        },
      },
    })
    metabaseToken: MetabaseToken,
  ): Promise<void> {
    await this.metabaseTokenRepository.updateById(id, metabaseToken);
  }

  @put('/metabase-tokens/{id}')
  @response(204, {
    description: 'MetabaseToken PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() metabaseToken: MetabaseToken,
  ): Promise<void> {
    await this.metabaseTokenRepository.replaceById(id, metabaseToken);
  }

  @del('/metabase-tokens/{id}')
  @response(204, {
    description: 'MetabaseToken DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.metabaseTokenRepository.deleteById(id);
  }
}
