// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
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
import {MessageRecipient} from '../models';
import {MessageRecipientRepository} from '../repositories';

const basePath = '/message-recipients';

export class MessageRecipientController {
  constructor(
    @repository(MessageRecipientRepository)
    public messageRecipientRepository: MessageRecipientRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.CreateMessageRecipient,
      PermissionKey.CreateMessageRecipientNum,
    ],
  })
  @post(basePath, {
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewMessageRecipient,
      PermissionKey.ViewMessageRecipientNum,
    ],
  })
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'MessageRecipient model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(MessageRecipient) where?: Where<MessageRecipient>,
  ): Promise<Count> {
    return this.messageRecipientRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewMessageRecipient,
      PermissionKey.ViewMessageRecipientNum,
    ],
  })
  @get(basePath, {
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
  async find(
    @param.filter(MessageRecipient) filter?: Filter<MessageRecipient>,
  ): Promise<MessageRecipient[]> {
    return this.messageRecipientRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateMessageRecipient,
      PermissionKey.UpdateMessageRecipientNum,
    ],
  })
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'MessageRecipient PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.ViewMessageRecipient,
      PermissionKey.ViewMessageRecipientNum,
    ],
  })
  @get(`${basePath}/{id}`, {
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
  async findById(
    @param.path.string('id') id: string,
    @param.filter(MessageRecipient, {exclude: 'where'})
    filter?: FilterExcludingWhere<MessageRecipient>,
  ): Promise<MessageRecipient> {
    return this.messageRecipientRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateMessageRecipient,
      PermissionKey.UpdateMessageRecipientNum,
    ],
  })
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'MessageRecipient PATCH success',
      },
    },
  })
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.UpdateMessageRecipient,
      PermissionKey.UpdateMessageRecipientNum,
    ],
  })
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'MessageRecipient PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() messageRecipient: MessageRecipient,
  ): Promise<void> {
    await this.messageRecipientRepository.replaceById(id, messageRecipient);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [
      PermissionKey.DeleteMessageRecipient,
      PermissionKey.DeleteMessageRecipientNum,
    ],
  })
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'MessageRecipient DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.messageRecipientRepository.deleteById(id);
  }
}
