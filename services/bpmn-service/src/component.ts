import {
  Binding,
  Component,
  ContextTags,
  ControllerClass,
  CoreBindings,
  inject,
  injectable,
  ProviderMap,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {BPMNServiceBindings, BpmnServiceComponentBindings} from './keys';
import {BpmnServiceComponentOptions} from './types';
import {BPMNBindings, BpmnProvider} from './providers';
import {AuthorizationBindings, AuthorizationComponent} from 'loopback4-authorization';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  ServiceSequence,
} from '@sourceloop/core';
import {Class, Model, Repository} from '@loopback/repository';
import {AuthenticationComponent} from 'loopback4-authentication';
import {WorkflowRepository, WorkflowVersionRepository} from './repositories';
import {Workflow, WorkflowVersion} from './models';
import {WorkflowsController} from './controllers';

// Configure the binding for BpmnServiceComponent
@injectable({tags: {[ContextTags.KEY]: BpmnServiceComponentBindings.COMPONENT}})
export class BpmnServiceComponent implements Component {
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

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(BPMNServiceBindings.BPMNServiceConfig, {optional: true})
    private readonly config?: BpmnServiceComponentOptions,
  ) {
    this.providers = {
      [BPMNBindings.BPMNProvider.key]: BpmnProvider,
    };
    this.bindings = [];

    this.setupSequence(this.bindings);
    this.repositories = [
      WorkflowRepository,
      WorkflowVersionRepository,
    ];

    this.models = [Workflow, WorkflowVersion];

    this.controllers = [WorkflowsController];
  }

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
