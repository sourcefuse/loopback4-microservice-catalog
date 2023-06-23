import {
  injectable,
  /* inject, */
  BindingScope,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {SurveyResponder, SurveyCycleWithRelations} from '../models';
import {SurveyRepository} from '../repositories/survey.repository';
@injectable({scope: BindingScope.TRANSIENT})
export class SurveyCycleService {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
  ) {}

  async sendEmailToResponder(
    surveyCycleResponder: SurveyResponder | undefined,
    surveyCycle: SurveyCycleWithRelations,
  ) {
    // Need to provide this as handler function
  }
}
