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
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enum/permission-key.enum';
import {SurveyCycle} from '../models';
import {SurveyCycleRepository} from '../repositories/survey-cycle.repository';
import {SurveyService} from '../services/survey.service';
import {SurveyRepository} from '../repositories';

const basePath = '/surveys/{surveyId}/survey-cycles';
const orderByCreatedOn = 'created_on DESC';

export class SurveyCycleController {
  constructor(
    @repository(SurveyCycleRepository)
    private surveyCycleRepository: SurveyCycleRepository,
    @repository(SurveyRepository)
    private surveyRepository: SurveyRepository,
    @service(SurveyService)
    private surveyService: SurveyService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateSurveyCycle,
      PermissionKey.CreateAnySurveyCycle,
    ],
  })
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'SurveyCycle model instance',
    content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(SurveyCycle)}},
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(SurveyCycle, {
            title: 'NewSurveyCycle',
            exclude: ['id'],
          }),
        },
      },
    })
    surveyCycle: Omit<SurveyCycle, 'id'>,
    @param.path.string('surveyId') surveyId: string,
  ): Promise<SurveyCycle> {
    await this.surveyService.validateAndGetSurvey(surveyId);
    surveyCycle.surveyId = surveyId;
    await this.surveyCycleRepository.create(surveyCycle);

    // fetch createdSurveyCycle with id
    const createdSurveyCycle = await this.surveyCycleRepository.findOne({
      order: [orderByCreatedOn],
      where: {
        surveyId,
      },
    });
    if (!createdSurveyCycle) {
      throw new HttpErrors.NotFound();
    }
    return createdSurveyCycle;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewSurveyCycle,
      PermissionKey.ViewAnySurveyCycle,
    ],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyCycle model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.path.string('surveyId') surveyId: string,
    @param.where(SurveyCycle) where?: Where<SurveyCycle>,
  ): Promise<Count> {
    return this.surveyCycleRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewSurveyCycle,
      PermissionKey.ViewAnySurveyCycle,
    ],
  })
  @get(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'Array of SurveyCycle model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SurveyCycle, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.string('surveyId') surveyId: string,
    @param.filter(SurveyCycle) filter?: Filter<SurveyCycle>,
  ): Promise<SurveyCycle[]> {
    return this.surveyCycleRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateAnySurveyCycle,
      PermissionKey.UpdateSurveyCycle,
    ],
  })
  @patch(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyCycle PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @param.path.string('surveyId') surveyId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SurveyCycle, {partial: true}),
        },
      },
    })
    surveyCycle: SurveyCycle,
    @param.where(SurveyCycle) where?: Where<SurveyCycle>,
  ): Promise<Count> {
    return this.surveyCycleRepository.updateAll(surveyCycle, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewAnySurveyCycle,
      PermissionKey.ViewSurveyCycle,
    ],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyCycle model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SurveyCycle, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('surveyId') surveyId: string,
    @param.path.string('id') id: string,
    @param.filter(SurveyCycle, {exclude: 'where'})
    filter?: FilterExcludingWhere<SurveyCycle>,
  ): Promise<SurveyCycle> {
    const surveyCycle = await this.surveyCycleRepository.findOne({
      ...filter,
      where: {id},
    });
    if (!surveyCycle) {
      throw new HttpErrors.NotFound('Entity not found');
    }
    return surveyCycle;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateAnySurveyCycle,
      PermissionKey.UpdateSurveyCycle,
    ],
  })
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'SurveyCycle PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @param.path.string('surveyId') surveyId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SurveyCycle, {partial: true}),
        },
      },
    })
    surveyCycle: SurveyCycle,
  ): Promise<void> {
    const updatedCount = await this.surveyCycleRepository.updateAll(
      surveyCycle,
      {
        id,
        surveyId,
      },
    );
    if (updatedCount.count === 0) {
      throw new HttpErrors.BadRequest('Entity not found.');
    }

    this.surveyRepository.updateById(surveyId, {
      endDate: surveyCycle.endDate,
    });
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteSurveyCycle,
      PermissionKey.DeleteAnySurveyCycle,
    ],
  })
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'SurveyCycle DELETE success',
  })
  async deleteById(
    @param.path.string('id') id: string,
    @param.path.string('surveyId') surveyId: string,
  ): Promise<void> {
    const deleteCount = await this.surveyCycleRepository.deleteAllHard({
      id,
      surveyId,
    });
    if (deleteCount.count === 0) {
      throw new HttpErrors.BadRequest('Entity not found.');
    }
  }
}
