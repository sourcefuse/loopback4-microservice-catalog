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

const basePath = '/events/{id}/attendees';

export class EventAttendeeController {
  constructor(
    @repository(EventRepository) protected eventRepository: EventRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewAttendee])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Array of Event has many Attendee',
        content: {
          'application/json': {
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
  @authorize([PermissionKey.CreateAttendee])
  @post(basePath, {
    responses: {
      '200': {
        description: 'Event model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Attendee)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Event.prototype.id,
    @requestBody({
      content: {
        'application/json': {
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
  @authorize([PermissionKey.UpdateAttendee])
  @patch(basePath, {
    responses: {
      '200': {
        description: 'Event.Attendee PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
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
  @authorize([PermissionKey.DeleteAttendee])
  @del(basePath, {
    responses: {
      '200': {
        description: 'Event.Attendee DELETE success count',
        content: {'application/json': {schema: CountSchema}},
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
