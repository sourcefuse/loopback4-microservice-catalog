import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {
  CollectorController,
  OriginatorController,
  ReplyAndForwardController,
} from './controllers';
import {Attachment, Group, Message, Meta, Thread} from './models';
import {
  AttachmentRepository,
  GroupRepository,
  MessageRepository,
  MetaRepository,
  ThreadRepository,
  ThreadViewRepository,
} from './repositories';
import {InMailBindings} from './keys';
import {IInMailServiceConfig} from './types';

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
    @inject(InMailBindings.Config, {optional: true})
    private readonly inMailConfig?: IInMailServiceConfig,
  ) {
    this.application.component(CoreComponent);
    this.models = [Meta, Thread, Message, Group, Attachment];
    this.controllers = [
      OriginatorController,
      CollectorController,
      ReplyAndForwardController,
    ];
    this.repositories = [
      MetaRepository,
      ThreadRepository,
      AttachmentRepository,
      MessageRepository,
      GroupRepository,
      ThreadViewRepository,
    ];

    if (!this.inMailConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }

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

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'In-mail Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });
  }

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   */
  setupSequence() {
    this.application.sequence(ServiceSequence);
  }
}
