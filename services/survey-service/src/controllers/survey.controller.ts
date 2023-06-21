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
import {CONTENT_TYPE, ILogger, LOGGER, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {SurveyRepository} from '../repositories/survey.repository';
import {SurveyService} from '../services/survey.service';
import {PermissionKey} from '../enum/permission-key.enum';
import {Survey, SurveyDto} from '../models';

const basePath = '/surveys';
export class SurveyController {
  constructor(
    @repository(SurveyRepository)
    private surveyRepository: SurveyRepository,
    @service(SurveyService)
    private surveyService: SurveyService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateSurvey, PermissionKey.CreateAnySurvey],
  })
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Survey model instance',
    content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Survey)}},
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(SurveyDto, {
            title: 'NewSurvey',
            exclude: ['id'],
          }),
        },
      },
    })
    survey: Omit<SurveyDto, 'id'>,
  ): Promise<Survey> {
    return this.surveyService.createSurvey(survey);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewSurvey, PermissionKey.ViewAnySurvey],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'Survey model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Survey) where?: Where<Survey>): Promise<Count> {
    return this.surveyRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewSurvey, PermissionKey.ViewAnySurvey],
  })
  @get(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'Array of Survey model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SurveyDto, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Survey) filter?: Filter<Survey>,
  ): Promise<SurveyDto[]> {
    return this.surveyRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateAnySurvey, PermissionKey.UpdateSurvey],
  })
  @patch(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'Survey PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {partial: true}),
        },
      },
    })
    survey: Survey,
    @param.where(Survey) where?: Where<Survey>,
  ): Promise<Count> {
    return this.surveyRepository.updateAll(survey, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewAnySurvey,
      PermissionKey.ViewSurvey,
      PermissionKey.ViewOpenSurvey,
    ],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'Survey model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Survey, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Survey, {exclude: 'where'})
    filter?: FilterExcludingWhere<Survey>,
  ): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      ...filter,
      where: {id},
    });
    if (!survey) {
      throw new HttpErrors.NotFound('Entity not found');
    }
    return survey;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateAnySurvey, PermissionKey.UpdateSurvey],
  })
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Survey PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SurveyDto, {partial: true}),
        },
      },
    })
    survey: SurveyDto,
  ): Promise<void> {
    return this.surveyService.updateSurvey(id, survey);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteSurvey, PermissionKey.DeleteAnySurvey],
  })
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Survey DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.surveyService.checkDeleteValidation(id);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.surveyService
      .deleteRelatedObjects(id)
      .catch(err => this.logger.error(JSON.stringify(err)));
    const deleteCount = await this.surveyRepository.deleteAll({
      id,
    });
    if (deleteCount.count === 0) {
      throw new HttpErrors.BadRequest('Entity not found.');
    }
  }
}
