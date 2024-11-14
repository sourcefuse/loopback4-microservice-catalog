// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
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
  AttachmentFileController,
  MessageController,
  MessageMessageController,
  MessageMessageRecipientController,
  MessageRecipientController,
  MessageRecipientMessageController,
} from './controllers';
import {ChatServiceBindings} from './keys';
import {
  AttachmentFile,
  AttachmentFileDto,
  Message,
  MessageRecipient,
} from './models';
import {
  AttachmentFileRepository,
  MessageRecipientRepository,
  MessageRepository,
} from './repositories';
import {
  AttachmentFileRepository as AttachmentFileSequelizeRepository,
  MessageRecipientRepository as MessageRecipientSequelizeRepository,
  MessageRepository as MessageSequelizeRepository,
} from './repositories/sequelize';
import {IChatServiceConfig} from './types';

export class ChatServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(ChatServiceBindings.Config, {optional: true})
    private readonly chatConfig?: IChatServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Chat Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    if (!this.chatConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }
    if (this.chatConfig?.useSequelize) {
      this.repositories = [
        MessageSequelizeRepository,
        MessageRecipientSequelizeRepository,
        AttachmentFileSequelizeRepository,
        SequelizeJwtKeysRepository,
      ];
    } else {
      this.repositories = [
        MessageRepository,
        MessageRecipientRepository,
        AttachmentFileRepository,
        JwtKeysRepository,
      ];
    }

    this.models = [
      Message,
      MessageRecipient,
      AttachmentFile,
      AttachmentFileDto,
    ];

    this.controllers = [
      MessageController,
      MessageRecipientController,
      MessageMessageController,
      MessageRecipientMessageController,
      MessageMessageRecipientController,
      AttachmentFileController,
    ];
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
