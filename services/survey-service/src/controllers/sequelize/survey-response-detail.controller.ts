import {repository} from '@loopback/repository';
import {SurveyResponseDetailRepository} from '../../repositories/sequelize';
import {SurveyResponseDetailViewController as SurveyResponseDetailViewJugglerController} from '../survey-response-detail.controller';
export class SurveyResponseDetailViewController extends SurveyResponseDetailViewJugglerController {
  constructor(
    @repository(SurveyResponseDetailRepository)
    public surveyResponseDetailRepository: SurveyResponseDetailRepository,
  ) {
    super(surveyResponseDetailRepository);
  }
}
