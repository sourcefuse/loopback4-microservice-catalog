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
} from '@loopback/rest';
import {Templates} from '../models';
import {TemplatesRepository} from '../repositories';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
const templatesRoutePath = '/templates';
const templatesIDRoutePath = '/templates/{id}';

export class TemplatesController {
  constructor(
    @repository(TemplatesRepository)
    public templatesRepository: TemplatesRepository,
  ) {}

  @post(templatesRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Templates model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Templates)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
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

  @get('/templates/count', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Templates model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Templates) where?: Where<Templates>,
  ): Promise<Count> {
    return this.templatesRepository.count(where);
  }

  @get(templatesRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Templates model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Templates, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Templates) filter?: Filter<Templates>,
  ): Promise<Templates[]> {
    return this.templatesRepository.find(filter);
  }

  @patch(templatesRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Templates PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Templates, {partial: true}),
        },
      },
    })
    templates: Templates,
    @param.where(Templates) where?: Where<Templates>,
  ): Promise<Count> {
    return this.templatesRepository.updateAll(templates, where);
  }

  @get(templatesIDRoutePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Templates model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Templates, {includeRelations: true}),
          },
        },
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

  @patch(templatesIDRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Templates PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Templates, {partial: true}),
        },
      },
    })
    templates: Templates,
  ): Promise<void> {
    await this.templatesRepository.updateById(id, templates);
  }

  @put(templatesIDRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Templates PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() templates: Templates,
  ): Promise<void> {
    await this.templatesRepository.replaceById(id, templates);
  }

  @del(templatesIDRoutePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Templates DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.templatesRepository.deleteById(id);
  }
}
