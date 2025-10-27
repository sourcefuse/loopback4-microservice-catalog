import {
  Count,
  DataObject,
  Options,
  repository,
  Where,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions, ILogger, LOGGER} from '@sourceloop/core';
import {Getter, inject} from '@loopback/core';

import {Section} from '../../models';
import {SurveyDbSourceName} from '../../types';
import {SurveyRepository} from '.';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';

export class SectionRepository extends SequelizeUserModifyCrudRepository<
  Section,
  typeof Section.prototype.id
> {
  constructor(
    @inject(`datasources.${SurveyDbSourceName}`)
    dataSource: SequelizeDataSource,
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(Section, dataSource, getCurrentUser);
  }

  async create(
    entity: DataObject<Section>,
    options?: Options | undefined,
  ): Promise<Section> {
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
      this._updateSurveyModifiedByAndOn(surveyQuestion.surveyId).catch(err =>
        this.logger.error(JSON.stringify(err)),
      );
    }
    return super.updateAll(data, where);
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
    await this.execute(query, parameters);
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
