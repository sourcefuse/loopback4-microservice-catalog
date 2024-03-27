import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {SurveyQuestionRepository} from '../repositories';
import {SurveyRepository} from '../repositories/survey.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyQuestionHelperService {
  constructor(
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  async reorder(surveyId: string, displayOrder: number) {
    this._updateSurveyModifiedByAndOn(surveyId).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
    const parameters = [surveyId, displayOrder];
    const query = `
      UPDATE survey_questions
      SET display_order = display_order + 1 
      WHERE survey_id = ? AND display_order >= ?`;
    this.surveyQuestionRepository
      .execute(query, parameters)
      .then()
      .catch(err => Promise.reject(err));
  }

  async _updateSurveyModifiedByAndOn(surveyId: string) {
    try {
      const surveyRepository = await this.surveyRepositoryGetter();

      await surveyRepository.updateById(surveyId, {
        id: surveyId,
      });
    } catch (err) {
      throw new HttpErrors.InternalServerError(err);
    }
  }
}
