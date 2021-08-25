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
import {Templates} from '../models';
import {TemplatesRepository} from '../repositories';
import {STATUS_CODE} from '@sourceloop/core';
const templatesRoutePath = '/templates';
const templatesIDRoutePath = '/templates/{id}';

export class TemplatesController {
  constructor(
    @repository(TemplatesRepository)
    public templatesRepository: TemplatesRepository,
  ) {}

  @post(templatesRoutePath)
  @response(STATUS_CODE.OK, {
    description: 'Templates model instance',
    content: {'application/json': {schema: getModelSchemaRef(Templates)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Templates, {
            title: 'NewTemplates',
          }),
        },
      },
    })
    templates: Templates,
  ): Promise<Templates> {
    return this.templatesRepository.create(templates);
  }

  @get('/templates/count')
  @response(STATUS_CODE.OK, {
    description: 'Templates model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Templates) where?: Where<Templates>,
  ): Promise<Count> {
    return this.templatesRepository.count(where);
  }

  @get(templatesRoutePath)
  @response(STATUS_CODE.OK, {
    description: 'Array of Templates model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Templates, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Templates) filter?: Filter<Templates>,
  ): Promise<Templates[]> {
    return this.templatesRepository.find(filter);
  }

  @patch(templatesRoutePath)
  @response(STATUS_CODE.OK, {
    description: 'Templates PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Templates, {partial: true}),
        },
      },
    })
    templates: Templates,
    @param.where(Templates) where?: Where<Templates>,
  ): Promise<Count> {
    return this.templatesRepository.updateAll(templates, where);
  }

  @get(templatesIDRoutePath)
  @response(STATUS_CODE.OK, {
    description: 'Templates model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Templates, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Templates, {exclude: 'where'})
    filter?: FilterExcludingWhere<Templates>,
  ): Promise<Templates> {
    return this.templatesRepository.findById(id, filter);
  }

  @patch(templatesIDRoutePath)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Templates PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Templates, {partial: true}),
        },
      },
    })
    templates: Templates,
  ): Promise<void> {
    await this.templatesRepository.updateById(id, templates);
  }

  @put(templatesIDRoutePath)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Templates PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() templates: Templates,
  ): Promise<void> {
    await this.templatesRepository.replaceById(id, templates);
  }

  @del(templatesIDRoutePath)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Templates DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.templatesRepository.deleteById(id);
  }
}
