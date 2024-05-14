import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, juggler, repository} from '@loopback/repository';
import {
  DefaultSoftCrudRepository,
  IAuthUserWithPermissions,
  ILogger,
  LOGGER,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {Question} from '../models';
import {Section} from '../models/section.model';
import {SurveyQuestion} from '../models/survey-question.model';
import {Survey} from '../models/survey.model';
import {SurveyDbSourceName} from '../types';
import {QuestionRepository} from './questions.repository';
import {SectionRepository} from './section.repository';
import {SurveyRepository} from './survey.repository';

export class SurveyQuestionRepository extends DefaultSoftCrudRepository<
  SurveyQuestion,
  typeof SurveyQuestion.prototype.id
> {
  public readonly dependentOnQuestion: BelongsToAccessor<
    SurveyQuestion,
    typeof SurveyQuestion.prototype.dependentOnQuestionId
  >;

  public readonly survey: BelongsToAccessor<
    Survey,
    typeof SurveyQuestion.prototype.id
  >;

  public readonly question: BelongsToAccessor<
    Question,
    typeof SurveyQuestion.prototype.id
  >;
  public readonly section: BelongsToAccessor<
    Section,
    typeof SurveyQuestion.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
    @repository.getter('QuestionRepository')
    protected questionRepositoryGetter: Getter<QuestionRepository>,
    @repository.getter('SectionRepository')
    protected sectionRepositoryGetter: Getter<SectionRepository>,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(SurveyQuestion, dataSource, getCurrentUser);
    this.section = this.createBelongsToAccessorFor(
      'section',
      sectionRepositoryGetter,
    );
    this.registerInclusionResolver('section', this.section.inclusionResolver);

    this.question = this.createBelongsToAccessorFor(
      'question',
      questionRepositoryGetter,
    );
    this.registerInclusionResolver('question', this.question.inclusionResolver);

    this.survey = this.createBelongsToAccessorFor(
      'survey',
      surveyRepositoryGetter,
    );
    this.registerInclusionResolver('survey', this.survey.inclusionResolver);

    this.dependentOnQuestion = this.createBelongsToAccessorFor(
      'dependentOnQuestion',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'dependentOnQuestion',
      this.dependentOnQuestion.inclusionResolver,
    );
  }
}
