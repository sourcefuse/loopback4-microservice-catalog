import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {IAuthUserWithPermissions, ILogger, LOGGER} from '@sourceloop/core';
import {Question, Survey, SurveyQuestion, Section} from '../../models';
import {QuestionRepository} from './questions.repository';
import {SurveyRepository} from './survey.repository';
import {SurveyDbSourceName} from '../../types';
import {SectionRepository} from './section.repository';
import {HttpErrors} from '@loopback/rest';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {SequelizeDataSource} from '@loopback/sequelize';

export class SurveyQuestionRepository extends SequelizeUserModifyCrudRepository<
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
    @inject(`datasources.${SurveyDbSourceName}`)
    dataSource: SequelizeDataSource,
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

  async reorder(surveyId: string, displayOrder: number) {
    this._updateSurveyModifiedByAndOn(surveyId).catch(err =>
      this.logger.error(JSON.stringify(err)),
    );
    const parameters = [surveyId, displayOrder];
    const query = `
      UPDATE survey_questions
      SET display_order = display_order + 1 
      WHERE survey_id = ? AND display_order >= ?`;
    await this.execute(query, parameters);
  }

  async _updateSurveyModifiedByAndOn(surveyId: string) {
    try {
      const surveyRepository = await this.surveyRepositoryGetter();

      await surveyRepository.updateById(surveyId, {
        id: surveyId,
      });
    } catch (err) {
      throw new HttpErrors.InternalServerError(err);
    }
  }
}
