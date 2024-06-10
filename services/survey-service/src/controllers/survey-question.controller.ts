import {service} from '@loopback/core';
import {
  AnyObject,
  Count,
  CountSchema,
  Filter,
  FilterBuilder,
  Where,
  WhereBuilder,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {AppErrorCodes, ErrorKeys, PermissionKey} from '../enum';
import {SurveyQuestion, SurveyQuestionDto} from '../models';
import {SurveyQuestionRepository} from '../repositories';
import {SurveyQuestionService, SurveyService} from '../services';

const basePath = '/surveys/{surveyId}/survey-questions';

export class SurveyQuestionController {
  constructor(
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @service(SurveyService)
    public surveyService: SurveyService,
    @service(SurveyQuestionService)
    public surveyQuestionService: SurveyQuestionService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateSurveyQuestion],
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
      return await this.surveyQuestionService.createSurveyQuestion(
        surveyId,
        surveyQuestionDto,
      );
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
      PermissionKey.ViewOpenSurveyQuestion,
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
      PermissionKey.ViewOpenSurveyQuestion,
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
    filter = this.addWhereToFilter(
      {surveyId},
      filter,
    ) as Filter<SurveyQuestion>;
    return this.surveyQuestionRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateSurveyQuestion],
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
      PermissionKey.ViewSurveyQuestion,
      PermissionKey.ViewOpenSurveyQuestion,
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
    @param.filter(SurveyQuestion)
    filter?: Filter<SurveyQuestion>,
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
    permissions: [PermissionKey.UpdateSurveyQuestion],
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
    this.updateModifiedBy(surveyId).catch(error => {
      throw new Error(error);
    });
  }

  async updateModifiedBy(surveyId: string) {
    await this.surveyService.updateModifiedByAndOn(surveyId);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteSurveyQuestion],
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
    permissions: [PermissionKey.UpdateSurveyQuestion],
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
    this.surveyQuestionRepository
      .reorder(surveyId, surveyQuestion.displayOrder)
      .then()
      .catch(error => {
        throw new Error(error);
      });
  }

  private addWhereToFilter<T extends object = AnyObject>(
    whereObject: Where<T>,
    filter?: Filter<T>,
  ): Filter<T> {
    const filterBuilder = new FilterBuilder<T>();
    const whereBuilder = new WhereBuilder<T>();
    if (!filter) {
      return filterBuilder.where(whereObject).build();
    }

    if (!filter.where) {
      filter.where = whereObject;
      return filter;
    }

    const where = whereBuilder
      .and([whereObject, ...this.getWhereWithAnd(filter.where)])
      .build();
    filter.where = where;
    return filter;
  }

  private getWhereWithAnd(where: AnyObject) {
    if (where?.and) {
      return where?.and;
    }
    return [where];
  }
}
