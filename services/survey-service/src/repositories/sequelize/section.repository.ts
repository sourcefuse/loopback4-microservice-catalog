import {Getter, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions, ILogger, LOGGER} from '@sourceloop/core';

import {SequelizeDataSource} from '@loopback/sequelize';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SurveyRepository} from '.';
import {Section} from '../../models';
import {SurveyDbSourceName} from '../../types';

export class SectionRepository extends SequelizeUserModifyCrudRepository<
  Section,
  typeof Section.prototype.id
> {
  constructor(
    @inject(`datasources.${SurveyDbSourceName}`)
    dataSource: SequelizeDataSource,
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(Section, dataSource, getCurrentUser);
  }
}
