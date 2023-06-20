import {Getter, inject} from '@loopback/core';
import {repository, BelongsToAccessor, juggler} from '@loopback/repository';
import {SurveyCycle, SurveyCycleRelations} from '../models/survey-cycle.model';
import {Survey} from '../models/survey.model';
import {SurveyDbSourceName} from '../types';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {SurveyRepository} from './survey.repository';

export class SurveyCycleRepository extends DefaultSoftCrudRepository<
  SurveyCycle,
  typeof SurveyCycle.prototype.id,
  SurveyCycleRelations
> {
  public readonly survey: BelongsToAccessor<
    Survey,
    typeof SurveyCycle.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
  ) {
    super(SurveyCycle, dataSource);
    this.survey = this.createBelongsToAccessorFor(
      'survey',
      surveyRepositoryGetter,
    );
    this.registerInclusionResolver('survey', this.survey.inclusionResolver);
  }
}
