import {
  injectable,
  /* inject, */
  BindingScope,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {OptionsRepository} from '../repositories/options.repository';
import {SurveyRepository} from '../repositories/survey.repository';
import {ErrorKeys} from '../enum/error-keys.enum';

const MAX_OPTIONS_ALLOWED = 12;

@injectable({scope: BindingScope.TRANSIENT})
export class QuestionOptionService {
  constructor(
    // @repository(SurveyRepository)
    // public surveyRepository: SurveyRepository,
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
