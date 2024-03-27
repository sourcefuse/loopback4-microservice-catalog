import {BindingScope, inject, injectable} from '@loopback/core';
import {DataObject, Options, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {SurveyResponder} from '../models';
import {SurveyResponderRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class SurveyResponderHelperService {
  constructor(
    @repository(SurveyResponderRepository)
    public surveyResponderRepository: SurveyResponderRepository,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  async create(
    entity: DataObject<SurveyResponder>,
    options?: Options | undefined,
  ): Promise<SurveyResponder> {
    const existingResponderCount = await this.surveyResponderRepository.count({
      surveyCycleId: entity.surveyCycleId,
      surveyId: entity.surveyId,
      email: entity.email,
    });
    if (existingResponderCount.count) {
      throw new HttpErrors.BadRequest('Responder Already Added');
    }
    return this.surveyResponderRepository.create(entity);
  }
}
