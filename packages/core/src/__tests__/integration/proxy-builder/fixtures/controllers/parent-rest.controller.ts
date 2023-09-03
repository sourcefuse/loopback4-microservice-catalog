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
import {Parent} from '../models';
import {ParentRepository} from '../repositories';

export class RestParentController {
  constructor(
    @repository(ParentRepository)
    public parentRepo: ParentRepository,
  ) {}

  @post('/rest-parents')
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Parent, {
            title: 'NewParent',
            exclude: ['id'],
          }),
        },
      },
    })
    parent: Omit<Parent, 'id'>,
  ): Promise<Parent> {
    return this.parentRepo.create(parent);
  }

  @get('/rest-parents/count')
  @response(200, {
    description: 'Parent model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Parent) where?: Where<Parent>): Promise<Count> {
    return this.parentRepo.count(where);
  }

  @get('/rest-parents')
  @response(200, {
    description: 'Array of Parent model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Parent, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Parent) filter?: Filter<Parent>): Promise<Parent[]> {
    return this.parentRepo.find(filter);
  }

  @patch('/rest-parents')
  @response(200, {
    description: 'Parent PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Parent, {partial: true}),
        },
      },
    })
    parent: Parent,
    @param.where(Parent) where?: Where<Parent>,
  ): Promise<Count> {
    return this.parentRepo.updateAll(parent, where);
  }

  @get('/rest-parents/{id}')
  @response(200, {
    description: 'Parent model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Parent, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Parent, {exclude: 'where'})
    filter?: FilterExcludingWhere<Parent>,
  ): Promise<Parent> {
    return this.parentRepo.findById(id, filter);
  }

  @patch('/rest-parents/{id}')
  @response(204, {
    description: 'Parent PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Parent, {partial: true}),
        },
      },
    })
    parent: Parent,
  ): Promise<void> {
    await this.parentRepo.updateById(id, parent);
  }

  @put('/rest-parents/{id}')
  @response(204, {
    description: 'Parent PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() parent: Parent,
  ): Promise<void> {
    await this.parentRepo.replaceById(id, parent);
  }

  @del('/rest-parents/{id}')
  @response(204, {
    description: 'Parent DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.parentRepo.deleteById(id);
  }
}
