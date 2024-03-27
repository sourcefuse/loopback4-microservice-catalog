import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  Survey,
  SurveyCycle,
  SurveyResponder,
  SurveyResponderRelations,
} from '../../models';
import {SurveyDbSourceName} from '../../types';
import {SurveyCycleRepository} from './survey-cycle.repository';
import {SurveyRepository} from './survey.repository';

export class SurveyResponderRepository extends SequelizeUserModifyCrudRepository<
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
    @inject(`datasources.${SurveyDbSourceName}`)
    dataSource: SequelizeDataSource,
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
