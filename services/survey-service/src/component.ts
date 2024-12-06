import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
  ServiceOrProviderClass,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  JwtKeysRepository,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {JwtKeysRepository as SequelizeJwtKeysRepository} from '@sourceloop/core/sequelize';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {
  OptionController,
  QuestionController,
  SectionController,
  SurveyCycleController,
} from './controllers';
import {TemplateController} from './controllers/question-template.controller';
import {SurveyQuestionController} from './controllers/survey-question.controller';
import {SurveyResponderController} from './controllers/survey-responder.controller';
import {SurveyResponseDetailViewController} from './controllers/survey-response-detail.controller';
import {SurveyResponseController} from './controllers/survey-response.controller';
import {SurveyController} from './controllers/survey.controller';
import {TemplateQuestionController} from './controllers/template-question.controller';
import {SurveyServiceBindings} from './keys';
import {
  Options,
  Question,
  Section,
  Survey,
  SurveyCycle,
  SurveyQuestion,
  SurveyQuestionDto,
  SurveyResponder,
  SurveyResponse,
  SurveyResponseDto,
} from './models';
import {QuestionDto} from './models/question-dto.model';
import {QuestionTemplatesDto} from './models/question-template-dto.model';
import {QuestionTemplate} from './models/question-template.model';
import {SurveyResponseDetail} from './models/survey-response-detail.model';
import {TemplateQuestion} from './models/template-questions.model';
import {
  QuestionRepository,
  SectionRepository,
  SurveyCycleRepository,
  SurveyQuestionRepository,
  SurveyResponderRepository,
  SurveyResponseDetailRepository,
  SurveyResponseRepository,
} from './repositories';
import {OptionsRepository} from './repositories/options.repository';
import {QuestionTemplateRepository} from './repositories/question-template.repository';
import {
  OptionsRepository as OptionsSequelizeRepository,
  QuestionRepository as QuestionSequelizeRepository,
  QuestionTemplateRepository as QuestionTemplateSequelizeRepository,
  SectionRepository as SectionSequelizeRepository,
  SurveyCycleRepository as SurveyCycleSequelizeRepository,
  SurveyQuestionRepository as SurveyQuestionSequelizeRepository,
  SurveyResponderRepository as SurveyResponderSequelizeRepository,
  SurveyResponseDetailRepository as SurveyResponseDetailSequelizeRepository,
  SurveyResponseRepository as SurveyResponseSequelizeRepository,
  SurveyRepository as SurveySequelizeRepository,
  TemplateQuestionRepository as TemplateQuestionSequelizeRepository,
} from './repositories/sequelize';
import {SurveyRepository} from './repositories/survey.repository';
import {TemplateQuestionRepository} from './repositories/template-questions.repository';
import {
  CreateSurveyHelperService,
  QuestionDuplicateHelperService,
  QuestionHelperService,
  QuestionTemplateService,
  SectionService,
  SurveyCycleService,
  SurveyQuestionService,
  SurveyResponderService,
  SurveyResponseService,
  SurveyService,
} from './services';
import {QuestionOptionService} from './services/question-option.service';
import {ISurveyServiceConfig} from './types';

export class SurveyServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    public readonly application: RestApplication,
    @inject(SurveyServiceBindings.Config, {optional: true})
    public readonly surveyConfig?: ISurveyServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    this.services = [
      QuestionHelperService,
      QuestionDuplicateHelperService,
      QuestionTemplateService,
      QuestionOptionService,
      CreateSurveyHelperService,
      SurveyService,
      SectionService,
      SurveyCycleService,
      SurveyQuestionService,
      SurveyResponseService,
      SurveyResponderService,
    ];
    if (this.surveyConfig?.useSequelize) {
      this.repositories = [
        QuestionSequelizeRepository,
        OptionsSequelizeRepository,
        TemplateQuestionSequelizeRepository,
        QuestionTemplateSequelizeRepository,
        SurveySequelizeRepository,
        SurveyQuestionSequelizeRepository,
        SurveyCycleSequelizeRepository,
        SurveyResponderSequelizeRepository,
        SectionSequelizeRepository,
        SurveyResponseSequelizeRepository,
        SurveyResponseDetailSequelizeRepository,
        SequelizeJwtKeysRepository,
      ];
    } else {
      this.repositories = [
        QuestionRepository,
        OptionsRepository,
        TemplateQuestionRepository,
        QuestionTemplateRepository,
        SurveyRepository,
        SurveyQuestionRepository,
        SurveyCycleRepository,
        SurveyResponderRepository,
        SectionRepository,
        SurveyResponseRepository,
        SurveyResponseDetailRepository,
        JwtKeysRepository,
      ];
    }

    this.models = [
      QuestionDto,
      Question,
      Options,
      QuestionTemplate,
      QuestionTemplatesDto,
      TemplateQuestion,
      Survey,
      SurveyQuestion,
      Section,
      SurveyCycle,
      SurveyQuestionDto,
      SurveyResponder,
      SurveyResponse,
      SurveyResponseDto,
      SurveyResponseDetail,
    ];

    this.controllers = [
      QuestionController,
      OptionController,
      TemplateQuestionController,
      TemplateController,
      SurveyController,
      SurveyQuestionController,
      SectionController,
      SurveyCycleController,
      SurveyResponderController,
      SurveyResponseController,
      SurveyResponseDetailViewController,
    ];

    // Mount core component
    this.application.component(CoreComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Survey Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    if (!this.surveyConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }
  }

  providers?: ProviderMap = {};
  bindings?: Binding[] = [];

  /**
   * An optional list of Repository classes to bind for dependency injection
   * via `app.repository()` API.
   */
  repositories?: Class<Repository<Model>>[];
  services?: ServiceOrProviderClass[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   *
   */

  setupSequence() {
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}
