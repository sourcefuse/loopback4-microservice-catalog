import {repository} from '@loopback/repository';
import {
  SurveyCycleRepository,
  SurveyRepository,
  SurveyResponderRepository,
  SurveyResponseRepository,
} from '../../repositories/sequelize';
import {SurveyResponderService, SurveyService} from '../../services/sequelize';
import {inject} from '@loopback/context';
import {service} from '@loopback/core';
import {LOGGER, ILogger} from '@sourceloop/core';
import {SurveyResponderController as SurveyResponderJugglerController} from '..';
export class SurveyResponderController extends SurveyResponderJugglerController {
  constructor(
    @repository(SurveyRepository)
    protected surveyRepository: SurveyRepository,
    @repository(SurveyResponderRepository)
    protected surveyResponderRepository: SurveyResponderRepository,
    @repository(SurveyResponseRepository)
    protected surveyResponseRepository: SurveyResponseRepository,
    @repository(SurveyCycleRepository)
    protected surveyCycleRepository: SurveyCycleRepository,
    @service(SurveyService)
    public surveyService: SurveyService,
    @service(SurveyResponderService)
    public surveyResponderService: SurveyResponderService,
    @inject(LOGGER.LOGGER_INJECT)
    public logger: ILogger,
  ) {
    super(
      surveyRepository,
      surveyResponderRepository,
      surveyResponseRepository,
      surveyCycleRepository,
      surveyService,
      surveyResponderService,
      logger,
    );
  }
}
