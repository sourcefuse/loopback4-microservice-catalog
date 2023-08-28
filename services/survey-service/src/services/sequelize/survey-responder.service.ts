import {injectable, BindingScope, inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {LOGGER, ILogger} from '@sourceloop/core';
import {SurveyResponderService as SurveyResponderJugglerService} from '..';
import {
  SurveyRepository,
  SurveyCycleRepository,
} from '../../repositories/sequelize';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyResponderService extends SurveyResponderJugglerService {
  constructor(
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository(SurveyCycleRepository)
    protected surveyCycleRepository: SurveyCycleRepository,
    @repository(SurveyRepository)
    protected surveyRepository: SurveyRepository,
  ) {
    super(logger, surveyCycleRepository, surveyRepository);
  }
}
