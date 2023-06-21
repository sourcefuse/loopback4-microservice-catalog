import {
  Count,
  DataObject,
  Options,
  repository,
  Where,
  juggler,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {Getter, inject} from '@loopback/core';

import {Section} from '../models/section.model';
import {SurveyDbSourceName} from '../types';
import {SurveyRepository} from './survey.repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';

export class SectionRepository extends DefaultSoftCrudRepository<
  Section,
  typeof Section.prototype.id
> {
  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,

    @repository.getter('UserRepository')
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(Section, dataSource);
  }

  async create(
    entity: DataObject<Section>,
    options?: Options | undefined,
  ): Promise<Section> {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._updateSurveyModifiedByAndOn(entity.surveyId as string).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
    return super.create(entity);
  }

  async updateAll(
    data: DataObject<Section>,
    where?: Where<Section> | undefined,
    options?: Options | undefined,
  ): Promise<Count> {
    const surveyQuestion = where as Section;
    if (surveyQuestion.surveyId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._updateSurveyModifiedByAndOn(surveyQuestion.surveyId).catch(err =>
        this.logger.error(JSON.stringify(err)),
      );
    }
    return super.updateAll(data, where);
  }

  async reorder(surveyId: string, displayOrder: number, tenantId: string) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._updateSurveyModifiedByAndOn(surveyId).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
    const parameters = [surveyId, displayOrder, tenantId];
    const query = `
      UPDATE ${process.env.DB_DATABASE}.section
      SET display_order = display_order - 1 
      WHERE survey_id = ? AND display_order > ? AND tenant_id = ?`;
    this.execute(query, parameters);
  }

  async _updateSurveyModifiedByAndOn(surveyId: string) {
    try {
      const surveyRepository = await this.surveyRepositoryGetter();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      surveyRepository.updateById(surveyId, {
        id: surveyId,
      });
    } catch (err) {
      throw new HttpErrors.InternalServerError(err);
    }
  }
}
