import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Attendee, Event} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {AttendeeRepository} from '../repositories';

const basePath = '/attendees/{id}/event';

export class AttendeeEventController {
  constructor(
    @repository(AttendeeRepository)
    public attendeeRepository: AttendeeRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewEvent])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Event belonging to Attendee',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Event)},
          },
        },
      },
    },
  })
  async getEvent(
    @param.path.string('id') id: typeof Attendee.prototype.id,
  ): Promise<Event> {
    return this.attendeeRepository.event(id);
  }
}
