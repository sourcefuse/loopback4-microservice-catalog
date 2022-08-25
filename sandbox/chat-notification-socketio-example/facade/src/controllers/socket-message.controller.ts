// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {CountSchema, Filter, Where} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  patch,
  getWhereSchemaFor,
} from '@loopback/rest';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {SocketMessageRecipient, SocketNotification} from '../models';
import {SocketMessage} from '../models/socket-message.model';
import {Messageservice, Notificationservice} from '../services';
import {
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {PermissionKey} from '../permission-key.enum';

export class PubnubMessageController {
  constructor(
    @inject('services.Messageservice')
    private readonly messageService: Messageservice,
    @inject('services.Notificationservice')
    private readonly notifService: Notificationservice,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewMessage]})
  @get('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Message model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(SocketMessage, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    // sonarignore:start
    @inject(AuthenticationBindings.CURRENT_USER) user: IAuthUserWithPermissions,
    @param.header.string('Authorization') token: string,
    @param.query.string('ChannelID') channelID?: string,
    @param.filter(SocketMessage) filter?: Filter<SocketMessage>,
    // sonarignore:end
  ): Promise<SocketMessage[]> {
    const filter1: Filter<SocketMessage> = {
      where: {
        channelId: channelID,
      },
      order: ['createdOn ASC'],
    };
    return this.messageService.getMessage(token, filter1);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateMessage]})
  @post('/messages', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(SocketMessage)},
        },
      },
    },
  })
  async create(
    @param.header.string('Authorization') token: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(SocketMessage, {
            title: 'Message',
            exclude: ['id'],
          }),
        },
      },
    })
    message: SocketMessage,
  ): Promise<SocketMessage> {
    message.channelId = message.channelId ?? message.toUserId;
    const msg = await this.messageService.createMessage(message, token);
    const msgrecipient = new SocketMessageRecipient({
      channelId: message.channelId,
      recipientId: message.toUserId ?? message.channelId,
      messageId: msg.id,
    });
    await this.messageService.createMessageRecipients(msgrecipient, token);
    const notif = new SocketNotification({
      subject: message.subject,
      body: message.body,
      type: 0,
      receiver: {
        to: [
          {
            type: 0,
            id: message.channelId,
          },
        ],
      },
    });
    await this.notifService.createNotification(notif, token);

    return msg;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateMessageRecipient]})
  @patch(`messages/{messageid}/markAsRead`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async patchMessageRecipients(
    @param.header.string('Authorization') token: string,
    @param.path.string('messageid') msgId: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(SocketMessageRecipient, {partial: true}),
        },
      },
    })
    messageRecipient: Partial<SocketMessageRecipient>, //NOSONAR
    @param.query.object('where', getWhereSchemaFor(SocketMessageRecipient))
    where?: Where<SocketMessageRecipient>, //NOSONAR
  ): Promise<SocketMessageRecipient> {
    const patched = {
      isRead: true,
    };

    return this.messageService.updateMsgRecipients(msgId, patched, token);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get('/userTenantId', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'To get the userTenantId',
        content: {
          [CONTENT_TYPE.TEXT]: {
            type: 'string',
          },
        },
      },
    },
  })
  async me(
    @inject(AuthenticationBindings.CURRENT_USER) user: IAuthUserWithPermissions,
    @param.header.string('Authorization') token: string, //NOSONAR
  ): Promise<string> {
    if (user.userTenantId) {
      return user.userTenantId;
    } else {
      return '';
    }
  }
}
