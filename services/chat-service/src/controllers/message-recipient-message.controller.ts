import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums';
import {Message, MessageRecipient} from '../models';
import {MessageRecipientRepository} from '../repositories';

const basePath = '/message-recipients/{id}/message';

export class MessageRecipientMessageController {
  constructor(
    @repository(MessageRecipientRepository)
    public messageRecipientRepository: MessageRecipientRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewMessage]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Message belonging to MessageRecipient',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(Message)},
          },
        },
      },
    },
  })
  async getMessage(
    @param.path.string('id') id: typeof MessageRecipient.prototype.id,
  ): Promise<Message> {
    return this.messageRecipientRepository.message(id);
  }
}
