import {BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import moment from 'moment';
import {SurveyCycle, SurveyResponder} from '../models';
import {SurveyCycleRepository} from '../repositories';
import {SurveyRepository} from '../repositories/survey.repository';
const sqlDateFormat = 'YYYY-MM-DD';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyCycleService {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @repository(SurveyCycleRepository)
    public surveyCycleRepository: SurveyCycleRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  async createSurveyCycle(
    surveyId: string,
    surveyCycle: Omit<SurveyCycle, 'id'>,
  ): Promise<SurveyCycle> {
    surveyCycle.surveyId = surveyId;

    await this.surveyCycleRepository.create(surveyCycle);

    // fetch createdSurveyCycle with id
    const orderByCreatedOn = 'created_on DESC';
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

  async validateSurveyCycle(surveyCycleId: string, surveyId: string) {
    const surveyCycle = await this.surveyCycleRepository.count({
      id: surveyCycleId,
      surveyId,
    });

    if (!surveyCycle) {
      throw new HttpErrors.BadRequest('Invalid surveyCycle Id');
    }
  }

  public async checkIfResponderAddedInActiveCycle(
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
  }

  async createFirstSurveyCycle(surveyId: string) {
    const survey = await this.surveyRepository.findById(surveyId);
    await this.surveyRepository.surveyCycles(surveyId).create({
      startDate: moment(new Date(survey.startDate)).format(sqlDateFormat),
      endDate: moment(new Date(survey.endDate)).format(sqlDateFormat),
      extId: survey.extId,
      surveyId,
      isActivated: true,
    });
    const surveyCycle = await this.surveyCycleRepository.findOne({
      where: {surveyId},
      order: ['created_on DESC'],
    });

    return Promise.all([
      this.surveyRepository
        .surveyResponders(surveyId)
        .patch({surveyCycleId: surveyCycle?.id}),
    ]);
  }
}
