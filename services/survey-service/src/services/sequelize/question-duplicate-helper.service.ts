import {ILogger, LOGGER} from '@sourceloop/core';
import {QuestionDuplicateHelperService as QuestionDuplicateHelperJugglerService} from '..';
import {
  QuestionRepository,
  OptionsRepository,
} from '../../repositories/sequelize';
import {BindingScope, inject, injectable} from '@loopback/context';
import {repository} from '@loopback/repository';
import {service} from '@loopback/core';
import {QuestionHelperService} from './question-helper.service';

@injectable({scope: BindingScope.TRANSIENT})
export class QuestionDuplicateHelperService extends QuestionDuplicateHelperJugglerService {
  constructor(
    @repository(QuestionRepository)
    public questionRepository: QuestionRepository,
    @repository(OptionsRepository)
    public optionsRepository: OptionsRepository,
    @service(QuestionHelperService)
    public questionHelperService: QuestionHelperService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(questionRepository, optionsRepository, questionHelperService, logger);
  }
}
