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
import {Child} from '../models';
import {ChildRepository} from '../repositories';

export class RestChildController {
  constructor(
    @repository(ChildRepository)
    public childRepo: ChildRepository,
  ) {}

  @post('/rest-children')
  @response(200, {
    description: 'Child model instance',
    content: {'application/json': {schema: getModelSchemaRef(Child)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Child, {
            title: 'NewChild',
            exclude: ['id'],
          }),
        },
      },
    })
    child: Omit<Child, 'id'>,
  ): Promise<Child> {
    return this.childRepo.create(child);
  }

  @get('/rest-children/count')
  @response(200, {
    description: 'Child model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Child) where?: Where<Child>): Promise<Count> {
    return this.childRepo.count(where);
  }

  @get('/rest-children')
  @response(200, {
    description: 'Array of Child model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Child, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Child) filter?: Filter<Child>): Promise<Child[]> {
    return this.childRepo.find(filter);
  }

  @patch('/rest-children')
  @response(200, {
    description: 'Child PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Child, {partial: true}),
        },
      },
    })
    child: Child,
    @param.where(Child) where?: Where<Child>,
  ): Promise<Count> {
    return this.childRepo.updateAll(child, where);
  }

  @get('/rest-children/{id}')
  @response(200, {
    description: 'Child model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Child, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Child, {exclude: 'where'})
    filter?: FilterExcludingWhere<Child>,
  ): Promise<Child> {
    return this.childRepo.findById(id, filter);
  }

  @patch('/rest-children/{id}')
  @response(204, {
    description: 'Child PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Child, {partial: true}),
        },
      },
    })
    child: Child,
  ): Promise<void> {
    await this.childRepo.updateById(id, child);
  }

  @put('/rest-children/{id}')
  @response(204, {
    description: 'Child PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() child: Child,
  ): Promise<void> {
    await this.childRepo.replaceById(id, child);
  }

  @del('/rest-children/{id}')
  @response(204, {
    description: 'Child DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.childRepo.deleteById(id);
  }
}
