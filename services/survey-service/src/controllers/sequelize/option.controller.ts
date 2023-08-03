import {repository} from '@loopback/repository';
import {OptionController as OptionJugglerController} from '..';
import {
  OptionsRepository,
  QuestionRepository,
} from '../../repositories/sequelize';
import {
  QuestionHelperService,
  QuestionOptionService,
} from '../../services/sequelize';
import {service} from '@loopback/core';
export class OptionController extends OptionJugglerController {
  constructor(
    @repository(OptionsRepository)
    public optionsRepository: OptionsRepository,
    @repository(QuestionRepository)
    public questionRepository: QuestionRepository,
    @service(QuestionHelperService)
    public questionHelperService: QuestionHelperService,
    @service(QuestionOptionService)
    public questionOptionService: QuestionOptionService,
  ) {
    super(
      optionsRepository,
      questionRepository,
      questionHelperService,
      questionOptionService,
    );
  }
}
