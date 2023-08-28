import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {QuestionTemplateService as QuestionTemplateJugglerService} from '../question-template.service';
import {
  QuestionTemplateRepository,
  TemplateQuestionRepository,
} from '../../repositories/sequelize';

@injectable({scope: BindingScope.TRANSIENT})
export class QuestionTemplateService extends QuestionTemplateJugglerService {
  constructor(
    @repository(QuestionTemplateRepository)
    public questionTemplateRepository: QuestionTemplateRepository,
    @repository(TemplateQuestionRepository)
    public templateQuestionRepository: TemplateQuestionRepository,
  ) {
    super(questionTemplateRepository, templateQuestionRepository);
  }
}
