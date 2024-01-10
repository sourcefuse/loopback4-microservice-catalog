import {
  /* inject, */
  BindingScope,
  injectable,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ErrorKeys} from '../enum/error-keys.enum';
import {OptionsRepository} from '../repositories/options.repository';
const MAX_OPTIONS_ALLOWED = 12;

@injectable({scope: BindingScope.TRANSIENT})
export class QuestionOptionService {
  constructor(
    @repository(OptionsRepository)
    public optionsRepository: OptionsRepository,
  ) {}

  async validateOptionCount(questionId: string) {
    const options = await this.optionsRepository.count({questionId});
    if (options.count >= MAX_OPTIONS_ALLOWED) {
      throw new HttpErrors.BadRequest(ErrorKeys.MaxOptionsInQuestionReached);
    }
  }
}
