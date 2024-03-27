import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {
  Count,
  DataObject,
  Options,
  Where,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {Section} from '../models';
import {SectionRepository} from '../repositories/section.repository';
import {SurveyRepository} from '../repositories/survey.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class SectionHelperService {
  constructor(
    @repository(SectionRepository)
    public sectionRepository: SectionRepository,
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  async create(
    entity: DataObject<Section>,
    options?: Options | undefined,
  ): Promise<Section> {
    this._updateSurveyModifiedByAndOn(entity.surveyId as string).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
    return this.sectionRepository.create(entity);
  }

  async updateAll(
    data: DataObject<Section>,
    where?: Where<Section> | undefined,
    options?: Options | undefined,
  ): Promise<Count> {
    const surveyQuestion = where as Section;
    if (surveyQuestion.surveyId) {
      this._updateSurveyModifiedByAndOn(surveyQuestion.surveyId).catch(err =>
        this.logger.error(JSON.stringify(err)),
      );
    }
    return this.sectionRepository.updateAll(data, where);
  }

  async reorder(surveyId: string, displayOrder: number) {
    this._updateSurveyModifiedByAndOn(surveyId).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
    const parameters = [surveyId, displayOrder];
    const query = `
      UPDATE ${process.env.SURVEY_DB_DATABASE}.section
      SET display_order = display_order - 1 
      WHERE survey_id = ? AND display_order > ?`;
    this.sectionRepository
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
