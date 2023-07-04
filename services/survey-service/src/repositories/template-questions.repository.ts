import {Getter, inject} from '@loopback/core';
import {repository, BelongsToAccessor, juggler} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {
  TemplateQuestion,
  TemplateQuestionRelations,
} from '../models/template-questions.model';
import {Question} from '../models';
import {QuestionTemplate} from '../models/question-template.model';
import {SurveyDbSourceName} from '../types';
import {QuestionRepository} from './questions.repository';
import {AuthenticationBindings} from 'loopback4-authentication';

export class TemplateQuestionRepository extends DefaultUserModifyCrudRepository<
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
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
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
