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
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Attachment, Event} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {EventRepository} from '../repositories';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';

const basePath = '/events/{id}/attachments';

export class EventAttachmentController {
  constructor(
    @repository(EventRepository) protected eventRepository: EventRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewAttachment]})
  @get(basePath, {
    description:
      'These requests will be available to everyone in the event to look at.',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Event has many Attachment',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(Attachment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Attachment>,
  ): Promise<Attachment[]> {
    return this.eventRepository.attachments(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateAttachment]})
  @post(basePath, {
    description:
      'Organizer can add attachments to the event (if it was missed while creating event).',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Attachment)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Event.prototype.id,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attachment, {
            title: 'NewAttachmentInEvent',
            exclude: ['id'],
            optional: ['eventId'],
          }),
        },
      },
    })
    attachment: Omit<Attachment, 'id'>,
  ): Promise<Attachment> {
    return this.eventRepository.attachments(id).create(attachment);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateAttachment]})
  @patch(basePath, {
    description: 'Organizer can update details of the attachment.',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event.Attachment PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attachment, {partial: true}),
        },
      },
    })
    attachment: Partial<Attachment>,
    @param.query.object('where', getWhereSchemaFor(Attachment))
    where?: Where<Attachment>,
  ): Promise<Count> {
    return this.eventRepository.attachments(id).patch(attachment, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteAttachment]})
  @del(basePath, {
    description: 'Organizer can delete the attachment.',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event.Attachment DELETE success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Attachment))
    where?: Where<Attachment>,
  ): Promise<Count> {
    return this.eventRepository.attachments(id).delete(where);
  }
}
