import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  SurveyCycleRepository,
  SurveyRepository,
} from '../../repositories/sequelize';
import {SurveyService} from '../../services/sequelize';
import {SurveyCycleController as SurveyCycleJugglerController} from '..';

export class SurveyCycleController extends SurveyCycleJugglerController {
  constructor(
    @repository(SurveyCycleRepository)
    public surveyCycleRepository: SurveyCycleRepository,
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @service(SurveyService)
    public surveyService: SurveyService,
  ) {
    super(surveyCycleRepository, surveyRepository, surveyService);
  }
}
