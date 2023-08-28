import {inject} from '@loopback/context';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {RestBindings, Request} from '@loopback/rest';
import {LOGGER, ILogger} from '@sourceloop/core';
import {SurveyRepository} from '../../repositories/sequelize';
import {SurveyService} from '../../services/sequelize';
import {SurveyController as SurveyJugglerController} from '..';
export class SurveyController extends SurveyJugglerController {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    public readonly request: Request,
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @service(SurveyService)
    public surveyService: SurveyService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    super(request, surveyRepository, surveyService, logger);
  }
}
