import {BindingScope, inject, injectable} from '@loopback/context';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {SurveyService as SurveyJugglerService} from '../survey.service';
import {
  QuestionRepository,
  QuestionTemplateRepository,
  SurveyCycleRepository,
  SurveyQuestionRepository,
  SurveyRepository,
  SurveyResponderRepository,
  TemplateQuestionRepository,
} from '../../repositories/sequelize';
import {SurveyCycleService} from './survey-cycle.service';
import {CreateSurveyHelperService} from './create-survey-helper.service';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyService extends SurveyJugglerService {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @repository(QuestionTemplateRepository)
    public questionTemplateRepository: QuestionTemplateRepository,
    @repository(TemplateQuestionRepository)
    public templateQuestionRepository: TemplateQuestionRepository,
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @repository(SurveyCycleRepository)
    public surveyCycleRepository: SurveyCycleRepository,
    @repository(SurveyResponderRepository)
    protected surveyResponderRepository: SurveyResponderRepository,
    @repository(QuestionRepository)
    protected questionRepository: QuestionRepository,

    @service(SurveyCycleService)
    public surveyCycleService: SurveyCycleService,
    @service(CreateSurveyHelperService)
    public createSurveyHelperService: CreateSurveyHelperService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(
      surveyRepository,
      questionTemplateRepository,
      templateQuestionRepository,
      surveyQuestionRepository,
      surveyCycleRepository,
      surveyResponderRepository,
      questionRepository,
      surveyCycleService,
      createSurveyHelperService,
      logger,
    );
  }
}
