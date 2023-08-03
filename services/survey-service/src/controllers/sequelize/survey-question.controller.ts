import {repository} from '@loopback/repository';
import {SurveyQuestionRepository} from '../../repositories/sequelize';
import {SurveyService} from '../../services/sequelize';
import {service} from '@loopback/core';
import {SurveyQuestionController as SurveyQuestionJugglerController} from '../survey-question.controller';

export class SurveyQuestionController extends SurveyQuestionJugglerController {
  constructor(
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @service(SurveyService)
    public surveyService: SurveyService,
  ) {
    super(surveyQuestionRepository, surveyService);
  }
}
