import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  Request,
  RestBindings,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {CONTENT_TYPE, ILogger, LOGGER, STATUS_CODE} from '@sourceloop/core';
import {JwtPayload, Secret, verify} from 'jsonwebtoken';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {ErrorKeys} from '../enum';
import {PermissionKey} from '../enum/permission-key.enum';
import {Survey, SurveyDto} from '../models';
import {SurveyRepository} from '../repositories/survey.repository';
import {SurveyService} from '../services/survey.service';

const basePath = '/surveys';
export class SurveyController {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    public readonly request: Request,
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @service(SurveyService)
    public surveyService: SurveyService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateSurvey],
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
    permissions: [PermissionKey.ViewSurvey],
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
    permissions: [PermissionKey.ViewSurvey],
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
    permissions: [PermissionKey.UpdateSurvey],
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
    permissions: [PermissionKey.ViewSurvey, PermissionKey.ViewOpenSurvey],
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
    filter?: Filter<Survey>,
  ): Promise<Survey> {
    const token = this.request.headers.authorization?.split(' ')[1] as string;
    const secret = process.env.JWT_SECRET as Secret;
    const decodedToken = verify(token, secret) as JwtPayload;
    if (decodedToken.surveyCycleId) {
      const responders = await this.surveyRepository.surveyResponders(id).find({
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
    permissions: [PermissionKey.UpdateSurvey],
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
    permissions: [PermissionKey.DeleteSurvey],
  })
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Survey DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.surveyService.checkDeleteValidation(id);

    this.surveyService.deleteRelatedObjects(id).catch(error => {
      throw new Error(error);
    });
    await this.surveyRepository.deleteById(id);
  }
}
