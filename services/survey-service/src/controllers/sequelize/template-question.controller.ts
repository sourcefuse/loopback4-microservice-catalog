import {inject} from '@loopback/context';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {LOGGER, ILogger} from '@sourceloop/core';
import {
  QuestionRepository,
  TemplateQuestionRepository,
} from '../../repositories/sequelize';
import {QuestionTemplateService} from '../../services/sequelize';
import {TemplateQuestionController as TemplateQuestionJugglerController} from '..';
export class TemplateQuestionController extends TemplateQuestionJugglerController {
  constructor(
    @repository(TemplateQuestionRepository)
    public templateQuestionRepository: TemplateQuestionRepository,
    @repository(QuestionRepository)
    public questionRepository: QuestionRepository,
    @service(QuestionTemplateService)
    public questionTemplateService: QuestionTemplateService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(
      templateQuestionRepository,
      questionRepository,
      questionTemplateService,
      logger,
    );
  }
}
