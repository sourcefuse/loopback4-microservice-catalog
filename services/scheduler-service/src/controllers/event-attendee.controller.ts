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
import {Attendee, Event} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {EventRepository} from '../repositories';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';

const basePath = '/events/{id}/attendees';

export class EventAttendeeController {
  constructor(
    @repository(EventRepository) protected eventRepository: EventRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewAttendee]})
  @get(basePath, {
    description:
      'Attendees are visible to everyone according to the access permissions provided to them.',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Event has many Attendee',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(Attendee)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Attendee>,
  ): Promise<Attendee[]> {
    return this.eventRepository.attendees(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateAttendee]})
  @post(basePath, {
    description:
      'Attendees could be added to the event. This action could only be performed by the organizer',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Attendee)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Event.prototype.id,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attendee, {
            title: 'NewAttendeeInEvent',
            exclude: ['id'],
            optional: ['eventId'],
          }),
        },
      },
    })
    attendee: Omit<Attendee, 'id'>,
  ): Promise<Attendee> {
    return this.eventRepository.attendees(id).create(attendee);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateAttendee]})
  @patch(basePath, {
    description:
      'Attendees can update details here. (Mainly accept or reject the invitation)',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event.Attendee PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attendee, {partial: true}),
        },
      },
    })
    attendee: Partial<Attendee>,
    @param.query.object('where', getWhereSchemaFor(Attendee))
    where?: Where<Attendee>,
  ): Promise<Count> {
    return this.eventRepository.attendees(id).patch(attendee, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteAttendee]})
  @del(basePath, {
    description:
      'Organiser is allowed to delete an attendee of an event. Event participants details from the past could not be created or updated.',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event.Attendee DELETE success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Attendee))
    where?: Where<Attendee>,
  ): Promise<Count> {
    return this.eventRepository.attendees(id).delete(where);
  }
}
