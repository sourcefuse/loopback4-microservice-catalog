import {BindingScope, inject, injectable} from '@loopback/context';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {QuestionHelperService as QuestionHelperJugglerService} from '../question-helper.service';
import {
  QuestionRepository,
  OptionsRepository,
  TemplateQuestionRepository,
  SurveyQuestionRepository,
} from '../../repositories/sequelize';
import {SurveyService} from './survey.service';
import {service} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class QuestionHelperService extends QuestionHelperJugglerService {
  constructor(
    @repository(QuestionRepository)
    public questionRepository: QuestionRepository,
    @repository(OptionsRepository)
    public optionsRepository: OptionsRepository,
    @repository(TemplateQuestionRepository)
    public templateQuestionRepository: TemplateQuestionRepository,
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @service(SurveyService)
    public surveyService: SurveyService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(
      questionRepository,
      optionsRepository,
      templateQuestionRepository,
      surveyQuestionRepository,
      surveyService,
      logger,
    );
  }
}
