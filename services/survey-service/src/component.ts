import {
  Component,
  CoreBindings,
  inject,
  ProviderMap,
  ControllerClass,
  Binding,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {ISurveyServiceConfig} from './types';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {Class, Model, Repository} from '@loopback/repository';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {SurveyServiceBindings} from './keys';
import {PingController, QuestionController} from './controllers';

export class SurveyServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(SurveyServiceBindings.Config, {optional: true})
    private readonly surveyConfig?: ISurveyServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    this.repositories = [];

    this.models = [];

    this.controllers = [PingController, QuestionController];

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
