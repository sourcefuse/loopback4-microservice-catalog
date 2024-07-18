import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  response,
} from '@loopback/rest';
import {STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enum/permission-key.enum';
import {SurveyResponseDetail} from '../models/survey-response-detail.model';
import {SurveyResponseDetailRepository} from '../repositories/survey-response-detail.repository';
const basePath = '/survey-cycles/{surveyCycleId}/survey-response-detail-view';

export class SurveyResponseDetailViewController {
  constructor(
    @repository(SurveyResponseDetailRepository)
    public surveyResponseDetailRepository: SurveyResponseDetailRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewSurveyResponseDetail],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyResponseDetailView model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.path.string('surveyCycleId') surveyCycleId: string,
    @param.where(SurveyResponseDetail)
    where?: Where<SurveyResponseDetail>,
  ): Promise<Count> {
    return this.surveyResponseDetailRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewSurveyResponseDetail],
  })
  @get(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'Array of SurveyResponseDetaimodel instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SurveyResponseDetail, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @param.path.string('surveyCycleId') surveyCycleId: string,
    @param.filter(SurveyResponseDetail)
    filter?: Filter<SurveyResponseDetail>,
  ): Promise<SurveyResponseDetail[]> {
    return this.surveyResponseDetailRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewSurveyResponseDetail],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyResponseDetailView model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SurveyResponseDetail, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.string('surveyCycleId') surveyCycleId: string,
    @param.path.string('id') id: string,
    @param.filter(SurveyResponseDetail, {exclude: 'where'})
    filter?: FilterExcludingWhere<SurveyResponseDetail>,
  ): Promise<SurveyResponseDetail> {
    const surveyResponse = await this.surveyResponseDetailRepository.findOne(
      filter,
    );
    if (!surveyResponse) {
      throw new HttpErrors.BadRequest('Entity not found');
    }
    return surveyResponse;
  }
}
