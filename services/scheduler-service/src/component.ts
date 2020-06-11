import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  ServiceSequence,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';

export class SchedulerServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);
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
   * @param bindings Binding array
   */
  setupSequence(bindings: Binding[]) {
    this.application.sequence(ServiceSequence);

    // Mount authentication component for default sequence
    this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    bindings.push(
      Binding.bind(BearerVerifierBindings.Config).to({
        authServiceUrl: '',
        type: BearerVerifierType.service,
      } as BearerVerifierConfig),
    );
    this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    bindings.push(
      Binding.bind(AuthorizationBindings.CONFIG).to({
        allowAlwaysPaths: ['/explorer'],
      }),
    );
    this.application.component(AuthorizationComponent);
  }
}
