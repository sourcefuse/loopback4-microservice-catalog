import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {param, getModelSchemaRef, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  sourceloopDelete,
  sourceloopGet,
  sourceloopPatch,
  sourceloopPost,
  sourceloopPut,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums';
import {MessageRecipient} from '../models';
import {MessageRecipientRepository} from '../repositories';

const basePath = '/message-recipients';

export class MessageRecipientController {
  constructor(
    @repository(MessageRecipientRepository)
    public messageRecipientRepository: MessageRecipientRepository,
  ) {}

  @sourceloopPost(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'MessageRecipient model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(MessageRecipient)},
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateMessageRecipient]})
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(MessageRecipient, {
            title: 'NewMessageRecipient',
            exclude: ['id'],
          }),
        },
      },
    })
    messageRecipient: Omit<MessageRecipient, 'id'>,
  ): Promise<MessageRecipient> {
    return this.messageRecipientRepository.create(messageRecipient);
  }

  @sourceloopGet(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'MessageRecipient model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewMessageRecipient]})
  async count(
    @param.where(MessageRecipient) where?: Where<MessageRecipient>,
  ): Promise<Count> {
    return this.messageRecipientRepository.count(where);
  }

  @sourceloopGet(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of MessageRecipient model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(MessageRecipient, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewMessageRecipient]})
  async find(
    @param.filter(MessageRecipient) filter?: Filter<MessageRecipient>,
  ): Promise<MessageRecipient[]> {
    return this.messageRecipientRepository.find(filter);
  }

  @sourceloopPatch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'MessageRecipient PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateMessageRecipient]})
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(MessageRecipient, {partial: true}),
        },
      },
    })
    messageRecipient: MessageRecipient,
    @param.where(MessageRecipient) where?: Where<MessageRecipient>,
  ): Promise<Count> {
    return this.messageRecipientRepository.updateAll(messageRecipient, where);
  }

  @sourceloopGet(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'MessageRecipient model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(MessageRecipient, {
              includeRelations: true,
            }),
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewMessageRecipient]})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(MessageRecipient, {exclude: 'where'})
    filter?: FilterExcludingWhere<MessageRecipient>,
  ): Promise<MessageRecipient> {
    return this.messageRecipientRepository.findById(id, filter);
  }

  @sourceloopPatch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'MessageRecipient PATCH success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateMessageRecipient]})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(MessageRecipient, {partial: true}),
        },
      },
    })
    messageRecipient: MessageRecipient,
  ): Promise<void> {
    await this.messageRecipientRepository.updateById(id, messageRecipient);
  }

  @sourceloopPut(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'MessageRecipient PUT success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateMessageRecipient]})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() messageRecipient: MessageRecipient,
  ): Promise<void> {
    await this.messageRecipientRepository.replaceById(id, messageRecipient);
  }

  @sourceloopDelete(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'MessageRecipient DELETE success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteMessageRecipient]})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.messageRecipientRepository.deleteById(id);
  }
}
