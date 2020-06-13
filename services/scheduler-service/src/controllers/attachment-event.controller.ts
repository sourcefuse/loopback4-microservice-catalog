import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Attachment, Event} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {AttachmentRepository} from '../repositories';
import {STATUS_CODE, CONTENT_TYPE} from '@sourceloop/core';

const basePath = '/attachments/{id}/event';

export class AttachmentEventController {
  constructor(
    @repository(AttachmentRepository)
    public attachmentRepository: AttachmentRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewEvent])
  @get(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event belonging to Attachment',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(Event)},
          },
        },
      },
    },
  })
  async getEvent(
    @param.path.string('id') id: typeof Attachment.prototype.id,
  ): Promise<Event> {
    return this.attachmentRepository.event(id);
  }
}
