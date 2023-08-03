import {Getter, inject} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  SurveyResponse,
  Question,
  Options,
  SurveyResponseDetail,
} from '../../models';
import {SurveyDbSourceName} from '../../types';
import {OptionsRepository} from './options.repository';
import {QuestionRepository} from './questions.repository';
import {SurveyResponseRepository} from './survey-response.repository';
import {repository, BelongsToAccessor} from '@loopback/repository';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {SequelizeDataSource} from '@loopback/sequelize';
export class SurveyResponseDetailRepository extends SequelizeUserModifyCrudRepository<
  SurveyResponseDetail,
  typeof SurveyResponseDetail.prototype.id
> {
  public readonly surveyResponse: BelongsToAccessor<
    SurveyResponse,
    typeof SurveyResponseDetail.prototype.id
  >;

  public readonly question: BelongsToAccessor<
    Question,
    typeof SurveyResponseDetail.prototype.id
  >;

  public readonly option: BelongsToAccessor<
    Options,
    typeof SurveyResponseDetail.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`)
    dataSource: SequelizeDataSource,

    @repository.getter('SurveyResponseRepository')
    protected surveyResponseRepositoryGetter: Getter<SurveyResponseRepository>,
    @repository.getter('QuestionRepository')
    protected questionRepositoryGetter: Getter<QuestionRepository>,
    @repository.getter('OptionsRepository')
    protected optionsRepositoryGetter: Getter<OptionsRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(SurveyResponseDetail, dataSource, getCurrentUser);
    this.option = this.createBelongsToAccessorFor(
      'option',
      optionsRepositoryGetter,
    );
    this.registerInclusionResolver('option', this.option.inclusionResolver);
    this.question = this.createBelongsToAccessorFor(
      'question',
      questionRepositoryGetter,
    );
    this.registerInclusionResolver('question', this.question.inclusionResolver);
    this.surveyResponse = this.createBelongsToAccessorFor(
      'surveyResponse',
      surveyResponseRepositoryGetter,
    );
    this.registerInclusionResolver(
      'surveyResponse',
      this.surveyResponse.inclusionResolver,
    );
  }
}
