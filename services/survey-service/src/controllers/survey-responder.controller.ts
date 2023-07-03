import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {CONTENT_TYPE, ILogger, LOGGER, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize, AuthorizeErrorKeys} from 'loopback4-authorization';
import {PermissionKey} from '../enum/permission-key.enum';
import {SurveyResponder} from '../models';
import {SurveyCycleRepository} from '../repositories/survey-cycle.repository';
import {SurveyResponderRepository} from '../repositories/survey-responder.repository';
import {SurveyRepository} from '../repositories/survey.repository';
import {SurveyService} from '../services/survey.service';
import {SurveyResponseRepository} from '../repositories/survey-response.repository';
import {ErrorKeys} from '../enum/error-keys.enum';
import {ResponderReminderDto} from '../models/responder-reminder-dto.model';
import {SurveyCycleService} from '../services/survey-cycle.service';
import {SurveyResponseService} from '../services/survey-response.service';

const basePath = '/surveys/{surveyId}/survey-responders';

export class SurveyResponderController {
  constructor(
    @repository(SurveyRepository)
    protected surveyRepository: SurveyRepository,
    @repository(SurveyResponderRepository)
    protected surveyResponderRepository: SurveyResponderRepository,
    @repository(SurveyResponseRepository)
    protected surveyResponseRepository: SurveyResponseRepository,
    @repository(SurveyCycleRepository)
    protected surveyCycleRepository: SurveyCycleRepository,
    @service(SurveyResponseService)
    private surveyResponseService: SurveyResponseService,
    @service(SurveyCycleService)
    private surveyCycleService: SurveyCycleService,
    @service(SurveyService)
    private surveyService: SurveyService,
    @inject(LOGGER.LOGGER_INJECT)
    public logger: ILogger,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateSurveyResponder,
      PermissionKey.CreateAnySurveyResponder,
    ],
  })
  @post(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'Survey model instance',
    content: {'application/json': {schema: getModelSchemaRef(SurveyResponder)}},
  })
  async create(
    @param.path.string('surveyId') surveyId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SurveyResponder, {
            title: 'NewSurveyResponderInSurvey',
            exclude: ['id'],
            optional: ['surveyId'],
          }),
        },
      },
    })
    surveyResponder: Omit<SurveyResponder, 'id'>,
  ): Promise<SurveyResponder> {
    if (surveyResponder.surveyId !== surveyId) {
      throw new HttpErrors.BadRequest(ErrorKeys.SurveyIdDoesNotMatch);
    }
    await this.surveyService.checkIfAllowedToUpdateSurvey(surveyId);

    if (surveyResponder.surveyCycleId) {
      await this.validateSurveyCycle(surveyResponder.surveyCycleId, surveyId);
    }
    surveyResponder.surveyId = surveyId;
    surveyResponder.firstName =
      surveyResponder.firstName ??
      surveyResponder.email.substring(0, surveyResponder.email.indexOf('@'));
    const resp = await this.surveyRepository
      .surveyResponders(surveyId)
      .create(surveyResponder);

    // fetch createdSurveyCycle with id
    const createdSurveyResponder = await this.surveyResponderRepository.findOne(
      {
        where: {surveyId},
        order: ['created_on DESC'],
      },
    );

    if (createdSurveyResponder) {
      if (createdSurveyResponder.surveyCycleId) {
        this.checkIfResponderAddedInActiveCycle(createdSurveyResponder).catch(
          err => this.logger.error(JSON.stringify(err)),
        );
      }
    }

    return resp;
  }

  private async checkIfResponderAddedInActiveCycle(
    surveyResponder: SurveyResponder,
  ) {
    const surveyCycle = await this.surveyCycleRepository.findById(
      surveyResponder.surveyCycleId,
      {
        include: [
          {
            relation: 'survey',
            scope: {
              fields: {name: true, id: true, createdBy: true},
            },
          },
        ],
      },
    );

    if (!surveyCycle?.isActivated) {
      return;
    }
    this.surveyCycleService
      .sendEmailToResponder(surveyResponder, surveyCycle)
      .catch(err => this.logger.error(JSON.stringify(err)));
  }

  async validateSurveyCycle(surveyCycleId: string, surveyId: string) {
    const surveyCycle = await this.surveyCycleRepository.count({
      id: surveyCycleId,
      surveyId,
    });

    if (!surveyCycle) {
      throw new HttpErrors.BadRequest('Invalid surveyCycle Id');
    }
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateResponderReminder],
  })
  @post(`${basePath}/reminder`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Send responders reminder',
  })
  async sendReminder(
    @param.path.string('surveyId') surveyId: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(ResponderReminderDto),
        },
      },
    })
    responderReminderDto: ResponderReminderDto,
  ): Promise<void> {
    const where = {
      id: {inq: responderReminderDto.surveyResponderIds},
      surveyId,
    };
    const surveyResponders = await this.surveyResponderRepository.count(where);
    if (
      surveyResponders.count !== responderReminderDto.surveyResponderIds.length
    ) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.surveyResponseService
      .sendResponderReminderEmail(surveyId, responderReminderDto)
      .catch(err => this.logger.error(JSON.stringify(err)));
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewSurveyResponder,
      PermissionKey.ViewAnySurveyResponder,
    ],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'SurveyResponder model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.path.string('surveyId') surveyId: string,
    @param.query.object('where') where?: Where<SurveyResponder>,
  ): Promise<Count> {
    return this.surveyResponderRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewSurveyResponder,
      PermissionKey.ViewAnySurveyResponder,
    ],
  })
  @get(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'Array of Survey has many SurveyResponder',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SurveyResponder, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.string('surveyId') surveyId: string,
    @param.query.object('filter') filter?: Filter<SurveyResponder>,
  ): Promise<SurveyResponder[]> {
    return this.surveyRepository.surveyResponders(surveyId).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateAnySurveyResponder,
      PermissionKey.UpdateSurveyResponder,
    ],
  })
  @patch(`${basePath}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Survey.SurveyResponder PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @param.path.string('surveyId') surveyId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SurveyResponder, {partial: true}),
        },
      },
    })
    surveyResponder: Partial<SurveyResponder>,
    @param.query.object('where', getWhereSchemaFor(SurveyResponder))
    where?: Where<SurveyResponder>,
  ): Promise<Count> {
    return this.surveyRepository
      .surveyResponders(surveyId)
      .patch(surveyResponder, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateAnySurveyResponder,
      PermissionKey.UpdateSurveyResponder,
    ],
  })
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Survey.SurveyResponder PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateById(
    @param.path.string('surveyId') surveyId: string,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SurveyResponder, {partial: true}),
        },
      },
    })
    surveyResponder: Partial<SurveyResponder>,
    @param.query.object('where', getWhereSchemaFor(SurveyResponder))
    where?: Where<SurveyResponder>,
  ): Promise<Count> {
    return this.surveyRepository
      .surveyResponders(surveyId)
      .patch(surveyResponder, {
        id,
      });
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteSurveyResponder,
      PermissionKey.DeleteAnySurveyResponder,
    ],
  })
  @del(`${basePath}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Survey.SurveyResponder DELETE success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async delete(
    @param.path.string('surveyId') surveyId: string,
    @param.query.object('where', getWhereSchemaFor(SurveyResponder))
    where?: Where<SurveyResponder>,
  ): Promise<Count> {
    const resp = await this.surveyRepository
      .surveyResponders(surveyId)
      .delete(where);

    return resp;
  }
}
