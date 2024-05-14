import {Getter, inject} from '@loopback/core';
import {juggler, repository} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
  ILogger,
  LOGGER,
} from '@sourceloop/core';

import {AuthenticationBindings} from 'loopback4-authentication';
import {Section} from '../models/section.model';
import {SurveyDbSourceName} from '../types';
import {SurveyRepository} from './survey.repository';

export class SectionRepository extends DefaultUserModifyCrudRepository<
  Section,
  typeof Section.prototype.id
> {
  constructor(
    @inject(`datasources.${SurveyDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
  ) {
    super(Section, dataSource, getCurrentUser);
  }
}
