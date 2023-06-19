import {inject} from '@loopback/core';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {
  QuestionTemplateRelations,
  QuestionTemplate,
} from '../models/question-template.model';
import {SurveyDbSourceName} from '../types';
import {juggler} from '@loopback/repository';

export class QuestionTemplateRepository extends DefaultSoftCrudRepository<
  QuestionTemplate,
  typeof QuestionTemplate.prototype.id,
  QuestionTemplateRelations
> {
  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(QuestionTemplate, dataSource);
  }
}
