import {CoreBindings, inject} from '@loopback/core';
import {SurveyServiceComponent as SurveyServiceJugglerComponent} from './component';
import {RestApplication} from '@loopback/rest';
import {SurveyServiceBindings} from './keys';
import {ISurveyServiceConfig} from './types';
import {
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
  CreateSurveyHelperService,
  QuestionDuplicateHelperService,
  QuestionOptionService,
  QuestionTemplateService,
  SectionService,
  SurveyCycleService,
  SurveyResponderService,
  SurveyResponseService,
  SurveyService,
  QuestionHelperService,
} from './sequelize.index';
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

export class SurveyServiceSequelizeComponent extends SurveyServiceJugglerComponent {
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
