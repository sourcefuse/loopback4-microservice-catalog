import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Options, OptionsRelations, Question} from '../../models';
import {QuestionRepository} from '.';
import {SurveyDbSourceName} from '../../types';
import {SequelizeDataSource} from '@loopback/sequelize';

export class OptionsRepository extends SequelizeUserModifyCrudRepository<
  Options,
  typeof Options.prototype.id,
  OptionsRelations
> {
  public readonly question: BelongsToAccessor<
    Question,
    typeof Options.prototype.id
  >;

  public readonly followupQuestion: BelongsToAccessor<
    Question,
    typeof Options.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`)
    dataSource: SequelizeDataSource,
    @repository.getter('QuestionRepository')
    protected questionRepositoryGetter: Getter<QuestionRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(Options, dataSource, getCurrentUser);
    this.followupQuestion = this.createBelongsToAccessorFor(
      'followupQuestion',
      questionRepositoryGetter,
    );
    this.registerInclusionResolver(
      'followupQuestion',
      this.followupQuestion.inclusionResolver,
    );
    this.question = this.createBelongsToAccessorFor(
      'question',
      questionRepositoryGetter,
    );
    this.registerInclusionResolver('question', this.question.inclusionResolver);
  }
}
