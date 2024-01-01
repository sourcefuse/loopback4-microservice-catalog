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
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {JwtPayload, Secret, verify} from 'jsonwebtoken';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {ErrorKeys} from '../enum';
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
    const token = this.request.headers.authorization?.split(' ')[1] as string;
    const secret = process.env.JWT_SECRET as Secret;
    const decodedToken = verify(token, secret) as JwtPayload;
    if (decodedToken.surveyCycleId) {
      const responders = await this.surveyRepository
        .surveyResponders(surveyId)
        .find({
          where: {
            surveyCycleId: decodedToken.surveyCycleId,
          },
        });
      const responderEmails: string[] = [];
      responders?.forEach(responder => {
        if (responder.email) {
          responderEmails.push(responder.email);
        }
      });
      const validUser = responderEmails.includes(decodedToken.email);
      if (!validUser) {
        throw new HttpErrors.Unauthorized(ErrorKeys.NotAuthorised);
      }
    }

    return this.surveyResponseService.createResponse(surveyId, surveyResponse);
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
    permissions: [PermissionKey.ViewSurveyResponse],
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
