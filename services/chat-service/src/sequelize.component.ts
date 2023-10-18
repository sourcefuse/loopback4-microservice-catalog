import {CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {ChatServiceComponent as ChatServiceJugglerComponent} from './component';
import {
  AttachmentFileController,
  MessageController,
  MessageMessageController,
  MessageMessageRecipientController,
  MessageRecipientController,
  MessageRecipientMessageController,
} from './controllers/sequelize';
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
} from './repositories/sequelize';
import {IChatServiceConfig} from './types';
export class ChatServiceComponent extends ChatServiceJugglerComponent {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected readonly application: RestApplication,
    @inject(ChatServiceBindings.Config, {optional: true})
    protected readonly chatConfig?: IChatServiceConfig,
  ) {
    super(application, chatConfig);
    this.repositories = [
      MessageRepository,
      MessageRecipientRepository,
      AttachmentFileRepository,
    ];

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
}
