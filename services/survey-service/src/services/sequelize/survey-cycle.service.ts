import {BindingScope, inject, injectable} from '@loopback/context';
import {SurveyCycleService as SurveyCycleJugglerService} from '../survey-cycle.service';
import {
  SurveyRepository,
  SurveyCycleRepository,
} from '../../repositories/sequelize';
import {ILogger, LOGGER} from '@sourceloop/core';
import {repository} from '@loopback/repository';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyCycleService extends SurveyCycleJugglerService {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @repository(SurveyCycleRepository)
    public surveyCycleRepository: SurveyCycleRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(surveyRepository, surveyCycleRepository, logger);
  }
}
