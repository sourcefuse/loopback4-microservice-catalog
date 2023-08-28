import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {QuestionRepository} from '../../repositories/sequelize';
import {
  QuestionDuplicateHelperService,
  QuestionHelperService,
} from '../../services/sequelize';
import {QuestionController as QuestionJugglerController} from '..';
export class QuestionController extends QuestionJugglerController {
  constructor(
    @repository(QuestionRepository)
    public questionRepository: QuestionRepository,
    @service(QuestionHelperService)
    public questionHelperService: QuestionHelperService,
    @service(QuestionDuplicateHelperService)
    public questionDuplicateHelperService: QuestionDuplicateHelperService,
  ) {
    super(
      questionRepository,
      questionHelperService,
      questionDuplicateHelperService,
    );
  }
}
