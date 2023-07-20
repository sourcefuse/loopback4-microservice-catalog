import {repository} from '@loopback/repository';
import {
  SurveyRepository,
  SurveyResponseRepository,
} from '../../repositories/sequelize';
import {SurveyResponseService} from '../../services/sequelize';
import {inject} from '@loopback/context';
import {service} from '@loopback/core';
import {RestBindings, Request} from '@loopback/rest';
import {SurveyResponseController as SurveyResponseJugglerController} from '../survey-response.controller';

export class SurveyResponseController extends SurveyResponseJugglerController {
  constructor(
    @repository(SurveyResponseRepository)
    public surveyResponseRepository: SurveyResponseRepository,
    @service(SurveyResponseService)
    public surveyResponseService: SurveyResponseService,
    @inject(RestBindings.Http.REQUEST)
    public readonly request: Request,
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
  ) {
    super(
      surveyResponseRepository,
      surveyResponseService,
      request,
      surveyRepository,
    );
  }
}
