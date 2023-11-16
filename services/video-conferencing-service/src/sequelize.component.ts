// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Binding, CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {IServiceConfig} from '@sourceloop/core';

import {VideoConfServiceComponent as JugglerVideoConfServiceComponent} from './component';

import {VideoChatArchiveController} from './controllers/sequelize/video-chat-archive.controller';
import {VideoChatSessionController} from './controllers/sequelize/video-chat-session.controller';
import {AuditLog} from './models';
import {AuditLogs} from './models/audit-logs.model';
import {VideoChatSession} from './models/video-chat-session.model';
import {TwilioProvider} from './providers/twilio/Sequelize/twilio.provider';
import {TwilioService} from './providers/twilio/Sequelize/twilio.service';
import {VonageProvider} from './providers/vonage/sequelize';
import {VonageService} from './providers/vonage/sequelize/vonage.service';
import {
  AuditLogRepository,
  AuditLogsRepository,
  SessionAttendeesRepository,
  VideoChatSessionRepository,
} from './repositories/sequelize';
import {
  MeetLinkGeneratorProvider,
  ServiceBindings,
  VideoChatBindings,
} from './sequelize.index';
import {MeetingLinkIdGeneratorProvider} from './services/sequelize';
import {ChatArchiveService} from './services/sequelize/chat-archive.service';
import {ChatSessionService} from './services/sequelize/chat-session.service';

export class VideoConfServiceComponent extends JugglerVideoConfServiceComponent {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected readonly application: RestApplication,
    @inject(VideoChatBindings.Config, {optional: true})
    protected readonly videoChatConfig?: IServiceConfig,
  ) {
    super(application, videoChatConfig);
    this.bindings = [];
    this.providers = {};

    this.bindings.push(
      Binding.bind(ServiceBindings.SessionChatService).toClass(
        ChatSessionService,
      ),
      Binding.bind(ServiceBindings.ArchiveChatService).toClass(
        ChatArchiveService,
      ),
    );

    this.application.service(VonageService);
    this.application.service(TwilioService);

    this.repositories = [
      AuditLogsRepository, // the legacy (and now deprecated) repository for audit logs. To support projects using logs from default migrations (using sql triggers) provided by this service.
      AuditLogRepository, // this is the new audit repository needed for `@sourceloop/audit-logs`.
      VideoChatSessionRepository,
      SessionAttendeesRepository,
    ];

    this.models = [AuditLogs, AuditLog, VideoChatSession];
    this.providers = {
      [VideoChatBindings.VideoChatProvider.key]: VonageProvider,
      [MeetLinkGeneratorProvider.key]: MeetingLinkIdGeneratorProvider,
      TwilioProvider,
    };

    this.controllers = [VideoChatArchiveController, VideoChatSessionController];
  }
}
