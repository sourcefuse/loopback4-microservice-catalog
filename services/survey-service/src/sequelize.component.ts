import {CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {SurveyServiceComponent as SurveyServiceJugglerComponent} from './component';
import {
  OptionController,
  QuestionController,
  SectionController,
  SurveyController,
  SurveyCycleController,
  SurveyQuestionController,
  SurveyResponderController,
  TemplateController,
  TemplateQuestionController,
} from './controllers/sequelize';
import {SurveyServiceBindings} from './keys';
import {
  CreateSurveyHelperService,
  OptionsRepository,
  QuestionDuplicateHelperService,
  QuestionHelperService,
  QuestionOptionService,
  QuestionRepository,
  QuestionTemplateRepository,
  QuestionTemplateService,
  SectionRepository,
  SectionService,
  SurveyCycleRepository,
  SurveyCycleService,
  SurveyQuestionRepository,
  SurveyRepository,
  SurveyResponderRepository,
  SurveyResponderService,
  SurveyResponseDetailRepository,
  SurveyResponseRepository,
  SurveyResponseService,
  SurveyService,
  TemplateQuestionRepository,
} from './sequelize.index';
import {ISurveyServiceConfig} from './types';

export class SurveyServiceComponent extends SurveyServiceJugglerComponent {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    public application: RestApplication,
    @inject(SurveyServiceBindings.Config, {optional: true})
    public readonly surveyConfig?: ISurveyServiceConfig,
  ) {
    super(application, surveyConfig);

    this.services = [
      QuestionHelperService,
      QuestionDuplicateHelperService,
      QuestionTemplateService,
      QuestionOptionService,
      CreateSurveyHelperService,
      SurveyCycleService,
      SurveyService,
      SectionService,
      SurveyResponseService,
      SurveyResponderService,
    ];

    this.repositories = [
      SurveyRepository,
      OptionsRepository,
      SectionRepository,
      QuestionRepository,
      SurveyCycleRepository,
      SurveyResponseRepository,
      SurveyQuestionRepository,
      SurveyResponderRepository,
      QuestionTemplateRepository,
      TemplateQuestionRepository,
      SurveyResponseDetailRepository,
    ];
    this.controllers = [
      OptionController,
      QuestionController,
      SectionController,
      SurveyController,
      SurveyCycleController,
      SurveyQuestionController,
      SurveyResponderController,
      TemplateController,
      TemplateQuestionController,
    ];
  }
}
