import {Getter, inject} from '@loopback/core';
import {
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
  juggler,
} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  SurveyResponse,
  SurveyResponseRelations,
  SurveyCycle,
  SurveyResponder,
} from '../models';
import {SurveyResponseDetail} from '../models/survey-response-detail.model';
import {SurveyCycleRepository} from './survey-cycle.repository';
import {SurveyResponderRepository} from './survey-responder.repository';
import {SurveyDbSourceName} from '../types';
import {SurveyResponseDetailRepository} from './survey-response-detail.repository';

export class SurveyResponseRepository extends DefaultUserModifyCrudRepository<
  SurveyResponse,
  typeof SurveyResponse.prototype.id,
  SurveyResponseRelations
> {
  public readonly surveyCycle: BelongsToAccessor<
    SurveyCycle,
    typeof SurveyResponse.prototype.id
  >;

  public readonly surveyResponseDetails: HasManyRepositoryFactory<
    SurveyResponseDetail,
    typeof SurveyResponse.prototype.id
  >;

  public readonly surveyResponder: BelongsToAccessor<
    SurveyResponder,
    typeof SurveyResponse.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,

    @repository.getter('SurveyCycleRepository')
    protected surveyCycleRepositoryGetter: Getter<SurveyCycleRepository>,
    @repository.getter('SurveyResponseDetailRepository')
    protected surveyResponseDetailRepositoryGetter: Getter<SurveyResponseDetailRepository>,
    @repository.getter('SurveyResponderRepository')
    protected surveyResponderRepositoryGetter: Getter<SurveyResponderRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(SurveyResponse, dataSource, getCurrentUser);
    this.surveyResponder = this.createBelongsToAccessorFor(
      'surveyResponder',
      surveyResponderRepositoryGetter,
    );
    this.registerInclusionResolver(
      'surveyResponder',
      this.surveyResponder.inclusionResolver,
    );
    this.surveyResponseDetails = this.createHasManyRepositoryFactoryFor(
      'surveyResponseDetails',
      surveyResponseDetailRepositoryGetter,
    );
    this.registerInclusionResolver(
      'surveyResponseDetails',
      this.surveyResponseDetails.inclusionResolver,
    );
    this.surveyCycle = this.createBelongsToAccessorFor(
      'surveyCycle',
      surveyCycleRepositoryGetter,
    );
    this.registerInclusionResolver(
      'surveyCycle',
      this.surveyCycle.inclusionResolver,
    );
  }
}
