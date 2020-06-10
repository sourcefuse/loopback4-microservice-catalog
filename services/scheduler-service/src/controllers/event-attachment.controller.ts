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

const basePath = '/events/{id}/attachments';

export class EventAttachmentController {
  constructor(
    @repository(EventRepository) protected eventRepository: EventRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewAttachment])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Array of Event has many Attachment',
        content: {
          'application/json': {
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
  @authorize([PermissionKey.CreateAttachment])
  @post(basePath, {
    responses: {
      '200': {
        description: 'Event model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Attachment)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Event.prototype.id,
    @requestBody({
      content: {
        'application/json': {
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
  @authorize([PermissionKey.UpdateAttachment])
  @patch(basePath, {
    responses: {
      '200': {
        description: 'Event.Attachment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
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
  @authorize([PermissionKey.DeleteAttachment])
  @del(basePath, {
    responses: {
      '200': {
        description: 'Event.Attachment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
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
