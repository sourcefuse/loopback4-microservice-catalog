import {inject, service} from '@loopback/core';
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
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  ILogger,
  LOGGER,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TemplateQuestionRepository} from '../repositories/template-questions.repository';
import {QuestionRepository} from '../repositories';
import {QuestionTemplateService} from '../services';
import {PermissionKey} from '../enum/permission-key.enum';
import {TemplateQuestion} from '../models/template-questions.model';
import {ErrorKeys} from '../enum/error-keys.enum';
import {AppErrorCodes} from '../enum/error-codes.enum';

const basePath = '/question-template/{templateId}/template-questions';
const orderByCreatedOn = 'created_on DESC';

export class TemplateQuestionController {
  constructor(
    @repository(TemplateQuestionRepository)
    private templateQuestionRepository: TemplateQuestionRepository,
    @repository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @service(QuestionTemplateService)
    private questionTemplateService: QuestionTemplateService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateTemplateQuestion,
      PermissionKey.CreateAnyTemplateQuestion,
    ],
  })
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Template Question model instance',
    content: {
      [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(TemplateQuestion)},
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(TemplateQuestion, {
            title: 'NewTemplateQuestion',
            exclude: ['id'],
          }),
        },
      },
    })
    templateQuestion: Omit<TemplateQuestion, 'id'>,
    @param.path.string('templateId') templateId: string,
  ): Promise<TemplateQuestion> {
    try {
      await this.questionTemplateService.checkIfAllowedTemplateQuestionToUpdate(
        templateId,
      );

      // create Template question
      templateQuestion.templateId = templateId;

      const checkQuestion = await this.questionRepository.count({
        id: templateQuestion.questionId,
      });
      if (!checkQuestion?.count) {
        throw new HttpErrors.BadRequest();
      }
      await this.templateQuestionRepository.create(templateQuestion);

      const createdTemplateQuestion =
        await this.templateQuestionRepository.findOne({
          order: [orderByCreatedOn],
        });
      if (!createdTemplateQuestion) {
        throw new HttpErrors.NotFound();
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.updateModifiedBy(templateId).catch(err =>
        this.logger.error(JSON.stringify(err)),
      );
      return createdTemplateQuestion;
    } catch (error) {
      if (error.code === AppErrorCodes.ER_DUP_ENTRY) {
        throw new HttpErrors.BadRequest(
          ErrorKeys.DuplicateTemplateQuestionEntry,
        );
      }
      throw error;
    }
  }

  async updateModifiedBy(templateId: string) {
    await this.questionTemplateService.updateModifiedByAndOn(templateId);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewTemplateQuestion,
      PermissionKey.ViewAnyTemplateQuestion,
    ],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'Question model count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async count(
    @param.path.string('templateId') templateId: string,
    @param.where(TemplateQuestion) where?: Where<TemplateQuestion>,
  ): Promise<Count> {
    return this.templateQuestionRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewTemplateQuestion,
      PermissionKey.ViewAnyTemplateQuestion,
    ],
  })
  @get(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Array of Template Question model instances',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TemplateQuestion, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @param.path.string('templateId') templateId: string,
    @param.filter(TemplateQuestion) filter?: Filter<TemplateQuestion>,
  ): Promise<TemplateQuestion[]> {
    return this.templateQuestionRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewTemplateQuestion,
      PermissionKey.ViewAnyTemplateQuestion,
    ],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'Question Question model instance',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: getModelSchemaRef(TemplateQuestion, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.string('templateId') templateId: string,
    @param.path.string('id') id: string,
    @param.filter(TemplateQuestion, {exclude: 'where'})
    filter?: FilterExcludingWhere<TemplateQuestion>,
  ): Promise<TemplateQuestion> {
    const templateQuestion = await this.templateQuestionRepository.findOne({
      ...filter,
      where: {id},
    });
    if (!templateQuestion) {
      throw new HttpErrors.NotFound('Entity not found');
    }
    return templateQuestion;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateTemplateQuestion,
      PermissionKey.UpdateAnyTemplateQuestion,
    ],
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Template Question PATCH success',
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(TemplateQuestion, {partial: true}),
          },
        },
      },
    })
    templateQuestions: TemplateQuestion[],
    @param.path.string('templateId') templateId: string,
  ): Promise<void> {
    this.questionTemplateService
      .updateModifiedByAndOn(templateId)
      .catch(err => this.logger.error(JSON.stringify(err)));

    const updateTemplateQuestionPromises: Promise<Count>[] = [];
    templateQuestions?.forEach(templateQuestion => {
      updateTemplateQuestionPromises.push(
        this.templateQuestionRepository.updateAll(templateQuestion, {
          id: templateQuestion.id,
          templateId,
        }),
      );
    });
    await Promise.all(updateTemplateQuestionPromises);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateTemplateQuestion,
      PermissionKey.UpdateAnyTemplateQuestion,
    ],
  })
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Question PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @param.path.string('templateId') templateId: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(TemplateQuestion, {partial: true}),
        },
      },
    })
    templateQuestion: TemplateQuestion,
  ): Promise<void> {
    await this.questionTemplateService.checkIfAllowedTemplateQuestionToUpdate(
      templateId,
    );
    const updatedCount = await this.templateQuestionRepository.updateAll(
      templateQuestion,
      {
        id,
        templateId,
      },
    );
    if (updatedCount.count === 0) {
      throw new HttpErrors.NotFound('Entity not found.');
    }
    this.updateModifiedByaAndAddUpdateLog(templateId).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
  }

  async updateModifiedByaAndAddUpdateLog(TemplateId: string) {
    await this.questionTemplateService.updateModifiedByAndOn(TemplateId);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteTemplateQuestion,
      PermissionKey.DeleteAnyTemplateQuestion,
    ],
  })
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Question Question DELETE success',
  })
  async deleteById(
    @param.path.string('templateId') templateId: string,
    @param.path.string('id') id: string,
  ): Promise<void> {
    await this.questionTemplateService.checkIfAllowedTemplateQuestionToUpdate(
      templateId,
    );
    const deleteCount = await this.templateQuestionRepository.deleteAllHard({
      templateId,
      id,
    });
    if (deleteCount.count === 0) {
      throw new HttpErrors.NotFound('Entity not found.');
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.updateModifiedByaAndAddDeleteLog(templateId).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
  }

  async updateModifiedByaAndAddDeleteLog(templateId: string) {
    await this.questionTemplateService.updateModifiedByAndOn(templateId);
  }
}
