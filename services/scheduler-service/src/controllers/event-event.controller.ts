import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Event} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {EventRepository} from '../repositories';

const basePath = '/events/{id}/event';

export class EventEventController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewEvent])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Event belonging to Event',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Event)},
          },
        },
      },
    },
  })
  async getEvent(
    @param.path.string('id') id: typeof Event.prototype.id,
  ): Promise<Event> {
    return this.eventRepository.parentEvent(id);
  }
}
