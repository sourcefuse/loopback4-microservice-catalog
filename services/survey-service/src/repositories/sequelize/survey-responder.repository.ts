import {SurveyCycleRepository} from './survey-cycle.repository';
import {SurveyRepository} from './survey.repository';
import {Getter, inject} from '@loopback/core';
import {
  repository,
  BelongsToAccessor,
  DataObject,
  Options,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  SurveyResponder,
  SurveyResponderRelations,
  Survey,
  SurveyCycle,
} from '../../models';
import {SurveyDbSourceName} from '../../types';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';

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

  async create(
    entity: DataObject<SurveyResponder>,
    options?: Options | undefined,
  ): Promise<SurveyResponder> {
    const existingResponderCount = await super.count({
      surveyCycleId: entity.surveyCycleId,
      surveyId: entity.surveyId,
      email: entity.email,
    });
    if (existingResponderCount.count) {
      throw new HttpErrors.BadRequest('Responder Already Added');
    }
    return super.create(entity);
  }
}
