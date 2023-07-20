import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {QuestionTemplateService} from '../../services/sequelize';
import {QuestionTemplateRepository} from '../../repositories/sequelize';
import {TemplateController as TemplateJugglerController} from '../question-template.controller';
export class TemplateController extends TemplateJugglerController {
  constructor(
    @repository(QuestionTemplateRepository)
    public questionTemplateRepository: QuestionTemplateRepository,
    @service(QuestionTemplateService)
    public questionTemplateService: QuestionTemplateService,
  ) {
    super(questionTemplateRepository, questionTemplateService);
  }
}
