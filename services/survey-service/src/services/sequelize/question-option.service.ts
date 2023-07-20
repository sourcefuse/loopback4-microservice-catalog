import {
  injectable,
  /* inject, */
  BindingScope,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {QuestionOptionService as QuestionOptionJugglerService} from '..';
import {OptionsRepository} from '../../repositories/sequelize';

@injectable({scope: BindingScope.TRANSIENT})
export class QuestionOptionService extends QuestionOptionJugglerService {
  constructor(
    @repository(OptionsRepository)
    public optionsRepository: OptionsRepository,
  ) {
    super(optionsRepository);
  }
}
