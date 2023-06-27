import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,
  post,
  HttpErrors,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {SurveyResponse, SurveyResponseDto} from '../models';
import {SurveyResponseRepository} from '../repositories/survey-response.repository';
import {SurveyResponseService} from '../services/survey-response.service';
import {PermissionKey} from '../enum/permission-key.enum';
import {service} from '@loopback/core';

const basePath = '/surveys/{surveyId}/survey-responses';

export class SurveyResponseController {
  constructor(
    @repository(SurveyResponseRepository)
    private surveyResponseRepository: SurveyResponseRepository,
    @service(SurveyResponseService)
    private surveyResponseService: SurveyResponseService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateSurveyResponse,
      PermissionKey.CreateAnySurveyResponse,
      PermissionKey.CreateOpenSurveyResponse,
    ],
  })
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'SurveyResponse model instance',
    content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(SurveyResponse)}},
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(SurveyResponseDto, {
            title: 'NewSurveyResponse',
          }),
        },
      },
    })
    surveyResponse: SurveyResponseDto,
    @param.path.string('surveyId') surveyId: string,
  ): Promise<SurveyResponse> {
    return this.surveyResponseService.createResponse(surveyId, surveyResponse);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewSurveyResponse,
      PermissionKey.ViewAnySurveyResponse,
    ],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyResponse model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SurveyResponse) where?: Where<SurveyResponse>,
  ): Promise<Count> {
    return this.surveyResponseRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewSurveyResponse,
      PermissionKey.ViewAnySurveyResponse,
      PermissionKey.ViewOpenSurveyResponse,
    ],
  })
  @get(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'Array of SurveyResponse model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SurveyResponse, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SurveyResponse) filter?: Filter<SurveyResponse>,
  ): Promise<SurveyResponse[]> {
    return this.surveyResponseRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewSurveyResponse,
      PermissionKey.ViewAnySurveyResponse,
    ],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyResponse model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SurveyResponse, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<SurveyResponse> {
    const surveyResponse = await this.surveyResponseRepository.findOne({
      where: {id},
    });
    if (!surveyResponse) {
      throw new HttpErrors.NotFound('Entity not found');
    }
    return surveyResponse;
  }
}
