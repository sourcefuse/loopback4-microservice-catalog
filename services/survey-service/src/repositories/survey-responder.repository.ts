import {SurveyCycleRepository} from './survey-cycle.repository';
import {SurveyRepository} from './survey.repository';
import {Getter, inject} from '@loopback/core';
import {
  repository,
  BelongsToAccessor,
  DataObject,
  Options,
  juggler,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  SurveyResponder,
  SurveyResponderRelations,
} from '../models/survey-responder.model';
import {SurveyDbSourceName} from '../types';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {Survey} from '../models/survey.model';
import {SurveyCycle} from '../models/survey-cycle.model';

export class SurveyResponderRepository extends DefaultSoftCrudRepository<
  SurveyResponder,
  typeof SurveyResponder.prototype.id,
  SurveyResponderRelations
> {
  public readonly survey: BelongsToAccessor<
    Survey,
    typeof SurveyResponder.prototype.id
  >;

  public readonly surveyCycle: BelongsToAccessor<
    SurveyCycle,
    typeof SurveyResponder.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
    @repository.getter('SurveyCycleRepository')
    protected surveyCycleRepositoryGetter: Getter<SurveyCycleRepository>,
  ) {
    super(SurveyResponder, dataSource);
    this.surveyCycle = this.createBelongsToAccessorFor(
      'surveyCycle',
      surveyCycleRepositoryGetter,
    );
    this.registerInclusionResolver(
      'surveyCycle',
      this.surveyCycle.inclusionResolver,
    );
    this.survey = this.createBelongsToAccessorFor(
      'survey',
      surveyRepositoryGetter,
    );
    this.registerInclusionResolver('survey', this.survey.inclusionResolver);
  }

  async create(
    entity: DataObject<SurveyResponder>,
    options?: Options | undefined,
  ): Promise<SurveyResponder> {
    const existingReponderCount = await super.count({
      surveyCycleId: entity.surveyCycleId,
      surveyId: entity.surveyId,
      email: entity.email,
    });
    if (existingReponderCount.count) {
      throw new HttpErrors.BadRequest('Responder Already Added');
    }
    return super.create(entity);
  }
}
