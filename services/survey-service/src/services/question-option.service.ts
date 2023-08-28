import {
  injectable,
  /* inject, */
  BindingScope,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {OptionsRepository} from '../repositories/options.repository';
import {ErrorKeys} from '../enum/error-keys.enum';
import {OptionsRepository as OptionsSequelizeRepo} from '../repositories/sequelize';
const MAX_OPTIONS_ALLOWED = 12;

@injectable({scope: BindingScope.TRANSIENT})
export class QuestionOptionService {
  constructor(
    @repository(OptionsRepository)
    public optionsRepository: OptionsRepository | OptionsSequelizeRepo,
  ) {}

  async validateOptionCount(questionId: string) {
    const options = await this.optionsRepository.count({questionId});
    if (options.count >= MAX_OPTIONS_ALLOWED) {
      throw new HttpErrors.BadRequest(ErrorKeys.MaxOptionsInQuestionReached);
    }
  }
}
