import {Getter, inject} from '@loopback/core';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {QuestionTemplate} from '../models/question-template.model';
import {SurveyDbSourceName} from '../types';
import {juggler} from '@loopback/repository';
import {AuthenticationBindings} from 'loopback4-authentication';

export class QuestionTemplateRepository extends DefaultUserModifyCrudRepository<
  QuestionTemplate,
  typeof QuestionTemplate.prototype.id
> {
  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(QuestionTemplate, dataSource, getCurrentUser);
  }
}
