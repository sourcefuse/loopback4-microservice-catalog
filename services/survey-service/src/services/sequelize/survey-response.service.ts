import {injectable, BindingScope, inject} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  SurveyResponseRepository,
  SurveyResponseDetailRepository,
  SurveyRepository,
  SurveyCycleRepository,
  SurveyResponderRepository,
} from '../../repositories/sequelize';
import {repository} from '@loopback/repository';
import {SurveyResponseService as SurveyResponseJugglerService} from '../survey-response.service';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyResponseService extends SurveyResponseJugglerService {
  constructor(
    @repository(SurveyResponseRepository)
    public surveyResponseRepository: SurveyResponseRepository,
    @repository(SurveyResponseDetailRepository)
    public surveyResponseDetailRepository: SurveyResponseDetailRepository,
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @repository(SurveyCycleRepository)
    protected surveyCycleRepository: SurveyCycleRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(SurveyResponderRepository)
    protected surveyResponderRepository: SurveyResponderRepository,
  ) {
    super(
      surveyResponseRepository,
      surveyResponseDetailRepository,
      surveyRepository,
      surveyCycleRepository,
      logger,
      surveyResponderRepository,
    );
  }
}
