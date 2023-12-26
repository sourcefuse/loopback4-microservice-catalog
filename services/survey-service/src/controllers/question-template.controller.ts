import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enum/permission-key.enum';
import {QuestionTemplatesDto} from '../models/question-template-dto.model';
import {QuestionTemplateResponse} from '../models/question-template-response.model';
import {QuestionTemplate} from '../models/question-template.model';
import {QuestionTemplateRepository} from '../repositories/question-template.repository';
import {QuestionTemplateService} from '../services/question-template.service';
const basePath = '/templates';

export class TemplateController {
  constructor(
    @repository(QuestionTemplateRepository)
    public questionTemplateRepository: QuestionTemplateRepository,
    @service(QuestionTemplateService)
    public questionTemplateService: QuestionTemplateService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateTemplate],
  })
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Template model instance',
    content: {
      [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(QuestionTemplate)},
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(QuestionTemplatesDto, {
            title: 'NewTemplate',
            exclude: ['id'],
          }),
        },
      },
    })
    questionnaire: Omit<QuestionTemplatesDto, 'id'>,
  ): Promise<QuestionTemplate> {
    return this.questionTemplateService.createTemplate(questionnaire);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewTemplate],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'Template model count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async count(
    @param.where(QuestionTemplate) where?: Where<QuestionTemplate>,
  ): Promise<Count> {
    return this.questionTemplateRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewTemplate],
  })
  @get(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Array of Template model instances',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: {
          type: 'array',
          items: getModelSchemaRef(QuestionTemplateResponse, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @param.filter(QuestionTemplate) filter?: Filter<QuestionTemplate>,
  ): Promise<QuestionTemplateResponse[]> {
    return this.questionTemplateRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewTemplate],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'QuestionTemplate model instance',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: getModelSchemaRef(QuestionTemplate, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(QuestionTemplate, {exclude: 'where'})
    filter?: FilterExcludingWhere<QuestionTemplate>,
  ): Promise<QuestionTemplate> {
    const template = await this.questionTemplateRepository.findOne({
      ...filter,
      where: {id},
    });
    if (!template) {
      throw new HttpErrors.BadRequest('Entity not found');
    }
    return template;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateTemplate],
  })
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Template PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(QuestionTemplatesDto, {partial: true}),
        },
      },
    })
    template: QuestionTemplatesDto,
  ): Promise<void> {
    return this.questionTemplateService.updateTemplate(id, template);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteTemplate],
  })
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Template DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.questionTemplateService.checkDeleteValidation(id);
    await this.questionTemplateService.deleteRelatedObjects(id);
    await this.questionTemplateRepository.deleteById(id);
  }
}
