import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SurveyCycle} from '../models/survey-cycle.model';
import {
  SurveyResponder,
  SurveyResponderRelations,
} from '../models/survey-responder.model';
import {Survey} from '../models/survey.model';
import {SurveyDbSourceName} from '../types';
import {SurveyCycleRepository} from './survey-cycle.repository';
import {SurveyRepository} from './survey.repository';

export class SurveyResponderRepository extends DefaultUserModifyCrudRepository<
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
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(SurveyResponder, dataSource, getCurrentUser);
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
}
