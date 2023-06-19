import {
  HasManyThroughRepositoryFactory,
  repository,
  HasManyRepositoryFactory,
  juggler,
} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {Survey, SurveyRelations} from '../models/survey.model';
import {SurveyCycle} from '../models/survey-cycle.model';
import {SurveyResponder} from '../models/survey-responder.model';
import {Question} from '../models';
import {SurveyQuestion} from '../models/survey-question.model';
import {SurveyDbSourceName} from '../types';
import {Getter, inject} from '@loopback/core';
import {QuestionRepository} from './questions.repository';

export class SurveyRepository extends DefaultSoftCrudRepository<
  Survey,
  typeof Survey.prototype.id,
  SurveyRelations
> {
  public readonly surveyCycles: HasManyRepositoryFactory<
    SurveyCycle,
    typeof Survey.prototype.id
  >;

  public readonly surveyResponders: HasManyRepositoryFactory<
    SurveyResponder,
    typeof Survey.prototype.id
  >;

  public readonly questions: HasManyThroughRepositoryFactory<
    Question,
    typeof Question.prototype.id,
    SurveyQuestion,
    typeof Survey.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('SurveyCycleRepository')
    // protected surveyCycleRepositoryGetter: Getter<SurveyCycleRepository>,
    // @repository.getter('SurveyResponderRepository')
    // protected surveyResponderRepositoryGetter: Getter<SurveyResponderRepository>,

    // @repository.getter('SurveyQuestionRepository')
    // protected surveyQuestionRepositoryGetter: Getter<SurveyQuestionRepository>,
    @repository.getter('QuestionRepository')
    protected questionRepositoryGetter: Getter<QuestionRepository>,
  ) {
    super(Survey, dataSource);

    // this.questions = this.createHasManyThroughRepositoryFactoryFor(
    //   'questions',
    //   questionRepositoryGetter,
    //   surveyQuestionRepositoryGetter,
    // );
    // this.registerInclusionResolver(
    //   'questions',
    //   this.questions.inclusionResolver,
    // );

    // this.surveyResponders = this.createHasManyRepositoryFactoryFor(
    //   'surveyResponders',
    //   surveyResponderRepositoryGetter,
    // );
    // this.registerInclusionResolver(
    //   'surveyResponders',
    //   this.surveyResponders.inclusionResolver,
    // );

    // this.surveyCycles = this.createHasManyRepositoryFactoryFor(
    //   'surveyCycles',
    //   surveyCycleRepositoryGetter,
    // );
    this.registerInclusionResolver(
      'surveyCycles',
      this.surveyCycles.inclusionResolver,
    );
  }
}
