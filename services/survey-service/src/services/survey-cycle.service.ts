import {BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import moment from 'moment';
import {SurveyCycleRepository} from '../repositories';
import {
  SurveyCycleRepository as SurveyCycleSequelizeRepo,
  SurveyRepository as SurveySequelizeRepo,
} from '../repositories/sequelize';
import {SurveyRepository} from '../repositories/survey.repository';
const sqlDateFormat = 'YYYY-MM-DD';
@injectable({scope: BindingScope.TRANSIENT})
export class SurveyCycleService {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository | SurveySequelizeRepo,
    @repository(SurveyCycleRepository)
    public surveyCycleRepository:
      | SurveyCycleRepository
      | SurveyCycleSequelizeRepo,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  async createFirstSurveyCycle(surveyId: string) {
    const survey = await this.surveyRepository.findById(surveyId);
    await this.surveyRepository.surveyCycles(surveyId).create({
      startDate: moment(new Date(survey.startDate)).format(sqlDateFormat),
      endDate: moment(new Date(survey.endDate)).format(sqlDateFormat),
      extId: survey.extId,
      surveyId,
    });
    const surveyCycle = await this.surveyCycleRepository.findOne({
      where: {surveyId},
    });

    return Promise.all([
      this.surveyRepository
        .surveyResponders(surveyId)
        .patch({surveyCycleId: surveyCycle?.id}),
    ]);
  }
}
