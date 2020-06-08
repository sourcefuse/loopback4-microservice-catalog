import {Class, Model, Repository} from '@loopback/repository';
import {VideoChatArchiveController} from './controllers/video-chat-archive.controller';
import {VideoChatSessionController} from './controllers/video-chat-session.controller';
import {VonageProvider} from './providers/vonage/vonage.provider';
import {AuditLogs} from './models/audit-logs.model';
import {VideoChatSession} from './models/video-chat-session.model';
import {VideoChatSessionRepository} from './repositories/video-chat-session.repository';
import {AuditLogsRepository} from './repositories/audit-logs.repository';

import {RestApplication} from '@loopback/rest';
import {IVideoChatServiceConfig} from './types';
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {VideoChatBindings} from './keys';
import { VonageBindings } from '../src/providers/vonage/keys';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  ServiceSequence,
} from '@sourcefuse-service-catalog/core';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
export class VideoConfServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(VideoChatBindings.Config, {optional: true})
    private readonly videChatConfig?: IVideoChatServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    if (!(this.videChatConfig && this.videChatConfig.useCustomSequence)) {
      // Mount default sequence if needed
      this.setupSequence(this.bindings);
    }

    this.repositories = [AuditLogsRepository, VideoChatSessionRepository];

    this.models = [AuditLogs, VideoChatSession];

    this.providers = {
      [VideoChatBindings.VideoChatProvider.key]: VonageProvider,
    };

    this.controllers = [VideoChatArchiveController, VideoChatSessionController];
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

    bindings.push(Binding.bind(VonageBindings.config).to({
      apiKey: process.env.VONAGE_API_KEY as string,
      apiSecret: process.env.VONAGE_API_SECRET as string,
    }));
    this.application.component(AuthorizationComponent);
  }
}
