import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {Question, QuestionRelations} from '../models/questions.model';
import {
  BelongsToAccessor,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {Options} from '../models/options.model';
import {Getter, inject} from '@loopback/core';
import {SurveyDbSourceName} from '../types';
import {OptionsRepository} from './options.repository';

export class QuestionRepository extends DefaultSoftCrudRepository<
  Question,
  typeof Question.prototype.id,
  QuestionRelations
> {
  public readonly rootQuestion: BelongsToAccessor<
    Question,
    typeof Question.prototype.id
  >;

  public readonly parentQuestion: BelongsToAccessor<
    Question,
    typeof Question.prototype.id
  >;

  public readonly options: HasManyRepositoryFactory<
    Options,
    typeof Question.prototype.id
  >;

  public readonly followUpQuestions: HasManyRepositoryFactory<
    Question,
    typeof Question.prototype.id
  >;

  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('OptionsRepository')
    protected optionsRepositoryGetter: Getter<OptionsRepository>,
  ) {
    super(Question, dataSource);

    this.followUpQuestions = this.createHasManyRepositoryFactoryFor(
      'followUpQuestions',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'followUpQuestions',
      this.followUpQuestions.inclusionResolver,
    );

    this.options = this.createHasManyRepositoryFactoryFor(
      'options',
      optionsRepositoryGetter,
    );
    this.registerInclusionResolver('options', this.options.inclusionResolver);

    this.parentQuestion = this.createBelongsToAccessorFor(
      'parentQuestion',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'parentQuestion',
      this.parentQuestion.inclusionResolver,
    );
    this.rootQuestion = this.createBelongsToAccessorFor(
      'rootQuestion',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'rootQuestion',
      this.rootQuestion.inclusionResolver,
    );
  }
}
