import {
  Component,
  CoreBindings,
  inject,
  ControllerClass,
  Binding,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierConfig,
  BearerVerifierType,
  BearerVerifierComponent,
  ServiceSequence,
  CoreComponent,
} from '@sourceloop/core';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {AuthenticationComponent} from 'loopback4-authentication';
import {Class, Repository, Model} from '@loopback/repository';
import {Meta, Thread, Attachment, Group, Message} from './models';
import {OriginatorController, CollectorController} from './controllers';
import {
  MetaRepository,
  ThreadRepository,
  AttachmentRepository,
  MessageRepository,
  GroupRepository,
} from './repositories';

export class InMailServiceComponent implements Component {
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
  bindings?: Binding[];
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
  ) {
    this.application.component(CoreComponent);
    this.models = [Meta, Thread, Message, Group, Attachment];
    this.controllers = [OriginatorController, CollectorController];
    this.repositories = [
      MetaRepository,
      ThreadRepository,
      AttachmentRepository,
      MessageRepository,
      GroupRepository,
    ];
    this.application.sequence(ServiceSequence);
    // Set up default home page
    this.application.component(AuthenticationComponent);
    this.application.bind(BearerVerifierBindings.Config).to({
      authServiceUrl: '',
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);
    this.application.component(BearerVerifierComponent);
    this.application.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.application.component(AuthorizationComponent);
  }
}
