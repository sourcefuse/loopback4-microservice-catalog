import {Getter, inject} from '@loopback/core';
import {repository, BelongsToAccessor} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';

import {
  Question,
  TemplateQuestion,
  TemplateQuestionRelations,
  QuestionTemplate,
} from '../../models';
import {SurveyDbSourceName} from '../../types';
import {QuestionRepository} from './questions.repository';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {SequelizeDataSource} from '@loopback/sequelize';

export class TemplateQuestionRepository extends SequelizeUserModifyCrudRepository<
  TemplateQuestion,
  typeof TemplateQuestion.prototype.id,
  TemplateQuestionRelations
> {
  public readonly question: BelongsToAccessor<
    Question,
    typeof TemplateQuestion.prototype.id
  >;

  public readonly questionTemplate: BelongsToAccessor<
    QuestionTemplate,
    typeof TemplateQuestion.prototype.id
  >;

  public readonly dependentOnQuestion: BelongsToAccessor<
    TemplateQuestion,
    typeof TemplateQuestion.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`)
    dataSource: SequelizeDataSource,
    @repository.getter('QuestionRepository')
    protected questionRepositoryGetter: Getter<QuestionRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(TemplateQuestion, dataSource, getCurrentUser);
    this.dependentOnQuestion = this.createBelongsToAccessorFor(
      'dependentOnQuestion',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'dependentOnQuestion',
      this.dependentOnQuestion.inclusionResolver,
    );

    this.question = this.createBelongsToAccessorFor(
      'question',
      questionRepositoryGetter,
    );
    this.registerInclusionResolver('question', this.question.inclusionResolver);
  }
}
