import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums';
import {Message, MessageRecipient} from '../models';
import {MessageRepository} from '../repositories';

const basePath = '/messages/{id}/message-recipients';

export class MessageMessageRecipientController {
  constructor(
    @repository(MessageRepository)
    protected messageRepository: MessageRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewMessageRecipient]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Message has many MessageRecipient',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(MessageRecipient)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<MessageRecipient>,
  ): Promise<MessageRecipient[]> {
    return this.messageRepository.messageRecipients(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateMessageRecipient]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(MessageRecipient)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Message.prototype.id,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(MessageRecipient, {
            title: 'NewMessageRecipientInMessage',
            exclude: ['id'],
            optional: ['messageId'],
          }),
        },
      },
    })
    messageRecipient: Omit<MessageRecipient, 'id'>,
  ): Promise<MessageRecipient> {
    return this.messageRepository
      .messageRecipients(id)
      .create(messageRecipient);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateMessageRecipient]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message.MessageRecipient PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(MessageRecipient, {partial: true}),
        },
      },
    })
    messageRecipient: Partial<MessageRecipient>,
    @param.query.object('where', getWhereSchemaFor(MessageRecipient))
    where?: Where<MessageRecipient>,
  ): Promise<Count> {
    return this.messageRepository
      .messageRecipients(id)
      .patch(messageRecipient, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteMessageRecipient]})
  @del(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message.MessageRecipient DELETE success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(MessageRecipient))
    where?: Where<MessageRecipient>,
  ): Promise<Count> {
    return this.messageRepository.messageRecipients(id).delete(where);
  }
}
