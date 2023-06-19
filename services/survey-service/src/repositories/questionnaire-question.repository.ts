import {Getter, inject} from '@loopback/core';
import {repository, BelongsToAccessor, juggler} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {
  TemplateQuestion,
  TemplateQuestionRelations,
} from '../models/template-questions.model';
import {Question} from '../models';
import {QuestionTemplate} from '../models/question-template.model';
import {SurveyDbSourceName} from '../types';
import {QuestionRepository} from './questions.repository';
import {QuestionTemplateRepository} from './question-template.repository';

export class TemplateQuestionRepository extends DefaultSoftCrudRepository<
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
    @repository.getter('QuestionTemplateRepository')
    protected questionTemplateRepositoryGetter: Getter<QuestionTemplateRepository>,
  ) {
    super(TemplateQuestion, dataSource);
    this.dependentOnQuestion = this.createBelongsToAccessorFor(
      'dependentOnQuestion',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'dependentOnQuestion',
      this.dependentOnQuestion.inclusionResolver,
    );

    this.questionTemplate = this.createBelongsToAccessorFor(
      'questionTemplate',
      questionTemplateRepositoryGetter,
    );
    this.registerInclusionResolver(
      'questionTemplate',
      this.questionTemplate.inclusionResolver,
    );
    this.question = this.createBelongsToAccessorFor(
      'question',
      questionRepositoryGetter,
    );
    this.registerInclusionResolver('question', this.question.inclusionResolver);
  }
}
