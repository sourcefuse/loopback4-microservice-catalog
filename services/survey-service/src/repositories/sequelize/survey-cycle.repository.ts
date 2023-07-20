import {Getter, inject} from '@loopback/core';
import {repository, BelongsToAccessor} from '@loopback/repository';
import {Survey, SurveyCycle, SurveyCycleRelations} from '../../models';
import {SurveyDbSourceName} from '../../types';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SurveyRepository} from '.';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {SequelizeDataSource} from '@loopback/sequelize';

export class SurveyCycleRepository extends SequelizeUserModifyCrudRepository<
  SurveyCycle,
  typeof SurveyCycle.prototype.id,
  SurveyCycleRelations
> {
  public readonly survey: BelongsToAccessor<
    Survey,
    typeof SurveyCycle.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`)
    dataSource: SequelizeDataSource,
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
