import {Getter, inject} from '@loopback/core';
import {repository, BelongsToAccessor, juggler} from '@loopback/repository';
import {SurveyCycle, SurveyCycleRelations} from '../models/survey-cycle.model';
import {Survey} from '../models/survey.model';
import {SurveyDbSourceName} from '../types';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {SurveyRepository} from './survey.repository';
import {AuthenticationBindings} from 'loopback4-authentication';

export class SurveyCycleRepository extends DefaultUserModifyCrudRepository<
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
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(SurveyCycle, dataSource, getCurrentUser);
    this.survey = this.createBelongsToAccessorFor(
      'survey',
      surveyRepositoryGetter,
    );
    this.registerInclusionResolver('survey', this.survey.inclusionResolver);
  }
}
