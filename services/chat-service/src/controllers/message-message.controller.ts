import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  sourceloopDelete,
  sourceloopGet,
  sourceloopPatch,
  sourceloopPost,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums';
import {Message} from '../models';
import {MessageRepository} from '../repositories';

const basePath = '/messages/{id}/messages';

export class MessageMessageController {
  constructor(
    @repository(MessageRepository)
    protected messageRepository: MessageRepository,
  ) {}

  @sourceloopGet(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Message has many Message',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(Message)},
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewMessage]})
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Message>,
  ): Promise<Message[]> {
    return this.messageRepository.messages(id).find(filter);
  }

  @sourceloopPost(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Message)}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateMessage]})
  async create(
    @param.path.string('id') id: typeof Message.prototype.id,
    @requestBody({
      security: OPERATION_SECURITY_SPEC,
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Message, {
            title: 'NewMessageInMessage',
            exclude: ['id'],
            optional: ['parentMessageId'],
          }),
        },
      },
    })
    message: Omit<Message, 'id'>,
  ): Promise<Message> {
    return this.messageRepository.messages(id).create(message);
  }

  @sourceloopPatch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message.Message PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateMessage]})
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Message, {partial: true}),
        },
      },
    })
    message: Partial<Message>,
    @param.query.object('where', getWhereSchemaFor(Message))
    where?: Where<Message>,
  ): Promise<Count> {
    return this.messageRepository.messages(id).patch(message, where);
  }

  @sourceloopDelete(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message.Message DELETE success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteMessage]})
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Message))
    where?: Where<Message>,
  ): Promise<Count> {
    return this.messageRepository.messages(id).delete(where);
  }
}
