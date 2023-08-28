import {inject, Getter} from '@loopback/core';
import {repository, BelongsToAccessor, juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Options, OptionsRelations, Question} from '../models';
import {QuestionRepository} from './questions.repository';
import {SurveyDbSourceName} from '../types';

export class OptionsRepository extends DefaultUserModifyCrudRepository<
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
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
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
