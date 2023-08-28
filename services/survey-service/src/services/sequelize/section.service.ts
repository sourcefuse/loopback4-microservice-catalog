import {
  injectable,
  /* inject, */
  BindingScope,
  inject,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  SectionRepository,
  SurveyQuestionRepository,
  SurveyRepository,
} from '../../repositories/sequelize';
import {SectionService as SectionJugglerService} from '..';

@injectable({scope: BindingScope.TRANSIENT})
export class SectionService extends SectionJugglerService {
  constructor(
    @repository(SectionRepository)
    public sectionRepository: SectionRepository,
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(
      sectionRepository,
      surveyQuestionRepository,
      surveyRepository,
      logger,
    );
  }
}
