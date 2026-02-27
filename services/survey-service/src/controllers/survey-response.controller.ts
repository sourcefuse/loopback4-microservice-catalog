import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import {CONTENT_TYPE, getModelSchemaRefSF, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enum/permission-key.enum';
import {SurveyResponse, SurveyResponseDto} from '../models';
import {SurveyRepository} from '../repositories';
import {SurveyResponseRepository} from '../repositories/survey-response.repository';
import {SurveyResponseService} from '../services/survey-response.service';
const basePath = '/surveys/{surveyId}/survey-responses';

export class SurveyResponseController {
  constructor(
    @repository(SurveyResponseRepository)
    public surveyResponseRepository: SurveyResponseRepository,
    @service(SurveyResponseService)
    public surveyResponseService: SurveyResponseService,
    @inject(RestBindings.Http.REQUEST)
    public readonly request: Request,
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateSurveyResponse,
      PermissionKey.CreateOpenSurveyResponse,
    ],
  })
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'SurveyResponse model instance',
    content: {
      [CONTENT_TYPE.JSON]: {schema: getModelSchemaRefSF(SurveyResponse)},
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(SurveyResponseDto, {
            title: 'NewSurveyResponse',
          }),
        },
      },
    })
    surveyResponse: SurveyResponseDto,
    @param.path.string('surveyId') surveyId: string,
  ): Promise<SurveyResponse> {
    const token = this.request.headers.authorization?.split(' ')[1] as string;

    return this.surveyResponseService.createResponse(
      token,
      surveyId,
      surveyResponse,
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewSurveyResponse],
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
          items: getModelSchemaRefSF(SurveyResponse, {includeRelations: true}),
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
    permissions: [PermissionKey.ViewSurveyResponse],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyResponse model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRefSF(SurveyResponse, {includeRelations: true}),
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
