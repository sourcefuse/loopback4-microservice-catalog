import {repository} from '@loopback/repository';
import {
  SectionRepository,
  SurveyQuestionRepository,
} from '../../repositories/sequelize';
import {SectionService} from '../../services/sequelize';
import {ILogger, LOGGER} from '@sourceloop/core';
import {inject} from '@loopback/context';
import {service} from '@loopback/core';
import {SectionController as SectionJugglerController} from '..';

export class SectionController extends SectionJugglerController {
  constructor(
    @repository(SectionRepository)
    public sectionRepository: SectionRepository,
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,

    @service(SectionService)
    public sectionService: SectionService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(sectionRepository, surveyQuestionRepository, sectionService, logger);
  }
}
