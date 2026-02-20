// Copyright (c) 2023 Sourcefuse Technologies
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
import {del, get, param, patch, post, put, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  getModelSchemaRefSF,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission-key.enum';
import {Templates} from '../models';
import {TemplatesRepository} from '../repositories';

const templatesRoutePath = '/templates';
const templatesIDRoutePath = '/templates/{id}';

export class TemplatesController {
  constructor(
    @repository(TemplatesRepository)
    public templatesRepository: TemplatesRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateTemplate,
      PermissionKey.CreateTemplateNum,
    ],
  })
  @post(templatesRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Templates model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRefSF(Templates)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Templates, {
            title: 'NewTemplates',
          }),
        },
      },
    })
    templates: Templates,
  ): Promise<Templates> {
    return this.templatesRepository.create(templates);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewTemplate, PermissionKey.ViewTemplateNum],
  })
  @get('/templates/count', {
    security: OPERATION_SECURITY_SPEC,
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewTemplate, PermissionKey.ViewTemplateNum],
  })
  @get(templatesRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Templates model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRefSF(Templates, {includeRelations: true}),
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateTemplate,
      PermissionKey.UpdateTemplateNum,
    ],
  })
  @patch(templatesRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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
          schema: getModelSchemaRefSF(Templates, {partial: true}),
        },
      },
    })
    templates: Templates,
    @param.where(Templates) where?: Where<Templates>,
  ): Promise<Count> {
    return this.templatesRepository.updateAll(templates, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewTemplate, PermissionKey.ViewTemplateNum],
  })
  @get(templatesIDRoutePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Templates model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRefSF(Templates, {includeRelations: true}),
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateTemplate,
      PermissionKey.UpdateTemplateNum,
    ],
  })
  @patch(templatesIDRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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
          schema: getModelSchemaRefSF(Templates, {partial: true}),
        },
      },
    })
    templates: Templates,
  ): Promise<void> {
    await this.templatesRepository.updateById(id, templates);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateTemplate,
      PermissionKey.UpdateTemplateNum,
    ],
  })
  @put(templatesIDRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.DeleteTemplate,
      PermissionKey.DeleteTemplateNum,
    ],
  })
  @del(templatesIDRoutePath, {
    security: OPERATION_SECURITY_SPEC,
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
