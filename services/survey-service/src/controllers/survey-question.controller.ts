import {SurveyQuestion, SurveyQuestionDto} from '../models';
import {SurveyQuestionRepository} from '../repositories';
import {SurveyService} from '../services';

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
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
  post,
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
import {AppErrorCodes, ErrorKeys, PermissionKey} from '../enum';

const basePath = '/surveys/{surveyId}/survey-questions';
const orderByCreatedOn = 'created_on DESC';

export class SurveyQuestionController {
  constructor(
    @repository(SurveyQuestionRepository)
    private surveyQuestionRepository: SurveyQuestionRepository,
    @service(SurveyService)
    private surveyService: SurveyService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateSurveyQuestion,
      PermissionKey.CreateAnySurveyQuestion,
    ],
  })
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'SurveyQuestion model instance',
    content: {
      [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(SurveyQuestionDto)},
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(SurveyQuestionDto, {
            title: 'NewSurveyQuestion',
            exclude: ['id'],
          }),
        },
      },
    })
    surveyQuestionDto: Omit<SurveyQuestionDto, 'id'>,
    @param.path.string('surveyId') surveyId: string,
  ): Promise<SurveyQuestion> {
    try {
      await this.surveyService.checkIfAllowedToUpdateSurvey(surveyId);

      const {...surveyQuestion} = surveyQuestionDto;

      surveyQuestion.surveyId = surveyId;
      await this.surveyQuestionRepository.create(surveyQuestion);

      // fetch createdSurveyQuestion with id
      const createdSurveyQuestion = await this.surveyQuestionRepository.findOne(
        {
          order: [orderByCreatedOn],
          where: {
            surveyId,
          },
        },
      );
      if (!createdSurveyQuestion) {
        throw new HttpErrors.NotFound();
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises

      return createdSurveyQuestion;
    } catch (error) {
      if (error.code === AppErrorCodes.ER_DUP_ENTRY) {
        throw new HttpErrors.BadRequest(ErrorKeys.DuplicateSurveyQuestionEntry);
      }
      throw error;
    }
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewSurveyQuestion,
      PermissionKey.ViewAnySurveyQuestion,
    ],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyQuestion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.path.string('surveyId') surveyId: string,
    @param.where(SurveyQuestion) where?: Where<SurveyQuestion>,
  ): Promise<Count> {
    return this.surveyQuestionRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewSurveyQuestion,
      PermissionKey.ViewAnySurveyQuestion,
    ],
  })
  @get(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'Array of SurveyQuestion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SurveyQuestion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.string('surveyId') surveyId: string,
    @param.filter(SurveyQuestion) filter?: Filter<SurveyQuestion>,
  ): Promise<SurveyQuestion[]> {
    return this.surveyQuestionRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateAnySurveyQuestion,
      PermissionKey.UpdateSurveyQuestion,
    ],
  })
  @patch(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyQuestion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SurveyQuestion, {partial: true}),
        },
      },
    })
    surveyQuestion: Partial<SurveyQuestion>,
    @param.path.string('surveyId') surveyId: string,
    @param.where(SurveyQuestion) where?: Where<SurveyQuestion>,
  ): Promise<Count> {
    await this.surveyService.checkIfAllowedToUpdateSurvey(surveyId);
    return this.surveyQuestionRepository.updateAll(surveyQuestion, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewAnySurveyQuestion,
      PermissionKey.ViewSurveyQuestion,
    ],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyQuestion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SurveyQuestion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.path.string('surveyId') surveyId: string,
    @param.filter(SurveyQuestion, {exclude: 'where'})
    filter?: FilterExcludingWhere<SurveyQuestion>,
  ): Promise<SurveyQuestion> {
    const surveyQuestion = await this.surveyQuestionRepository.findOne(filter);
    if (!surveyQuestion) {
      throw new HttpErrors.NotFound('Entity not found');
    }
    return surveyQuestion;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateAnySurveyQuestion,
      PermissionKey.UpdateSurveyQuestion,
    ],
  })
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'SurveyQuestion PATCH success',
  })
  async updateById(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SurveyQuestion, {partial: true}),
        },
      },
    })
    surveyQuestion: Partial<SurveyQuestion>,
    @param.path.string('surveyId') surveyId: string,
    @param.path.string('id') id: string,
  ): Promise<void> {
    const existingSurveyQuestion = await this.surveyQuestionRepository.findById(
      id,
    );
    const updatedCount = await this.surveyQuestionRepository.updateAll(
      surveyQuestion,
      {
        id,
        surveyId,
      },
    );
    if (updatedCount.count === 0) {
      throw new HttpErrors.BadRequest('Entity not found.');
    }
    this.updateModifiedByAndAddLog(surveyId, existingSurveyQuestion).catch(
      err => this.logger.error(JSON.stringify(err)),
    );
  }

  async updateModifiedByAndAddLog(
    surveyId: string,
    existingSurveyQuestion: SurveyQuestion,
  ) {
    await this.surveyService.updateModifiedByAndOn(surveyId);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteSurveyQuestion,
      PermissionKey.DeleteAnySurveyQuestion,
    ],
  })
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'SurveyQuestion DELETE success',
  })
  async deleteById(
    @param.path.string('surveyId') surveyId: string,
    @param.path.string('id') id: string,
  ): Promise<void> {
    const deleteCount = await this.surveyQuestionRepository.deleteAllHard({
      id,
      surveyId,
    });
    if (deleteCount.count === 0) {
      throw new HttpErrors.BadRequest('Entity not found.');
    }
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateAnySurveyQuestion,
      PermissionKey.UpdateSurveyQuestion,
    ],
  })
  @patch(`${basePath}/reorder`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Survey Question order PATCH success',
      },
    },
  })
  async reorder(
    @param.path.string('surveyId') surveyId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SurveyQuestion, {
            partial: true,
          }),
        },
      },
    })
    surveyQuestion: SurveyQuestion,
  ): Promise<void> {
    if (!surveyQuestion.displayOrder) {
      throw new HttpErrors.BadRequest(ErrorKeys.DisplayOrderMissing);
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.surveyQuestionRepository
      .reorder(surveyId, surveyQuestion.displayOrder)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch(err => this.logger.error(JSON.stringify(err)));
  }
}
