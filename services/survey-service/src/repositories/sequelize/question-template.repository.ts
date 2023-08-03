import {Getter, inject} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {QuestionTemplate} from '../../models';
import {SurveyDbSourceName} from '../../types';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {SequelizeDataSource} from '@loopback/sequelize';

export class QuestionTemplateRepository extends SequelizeUserModifyCrudRepository<
  QuestionTemplate,
  typeof QuestionTemplate.prototype.id
> {
  constructor(
    @inject(`datasources.${SurveyDbSourceName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(QuestionTemplate, dataSource, getCurrentUser);
  }
}
