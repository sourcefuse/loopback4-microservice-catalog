import {
  injectable,
  /* inject, */
  BindingScope,
  inject,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  SurveyResponder,
  SurveyCycleWithRelations,
  SurveyCycle,
} from '../models';
import {SurveyRepository} from '../repositories/survey.repository';
import moment from 'moment';
import {SurveyCycleRepository} from '../repositories';
import {LOGGER, ILogger} from '@sourceloop/core';
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

  async createFirstSurveyCycle(surveyId: string) {
    const survey = await this.surveyRepository.findById(surveyId);
    await this.surveyRepository.surveyCycles(surveyId).create({
      startDate: moment(new Date(survey.startDate)).format(sqlDateFormat),
      endDate: moment(new Date(survey.endDate)).format(sqlDateFormat),
      surveyId: surveyId,
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
