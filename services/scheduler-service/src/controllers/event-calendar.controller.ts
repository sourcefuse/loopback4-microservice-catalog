import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, Event} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {EventRepository} from '../repositories';

const basePath = '/events/{id}/calendar';

export class EventCalendarController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewCalendar])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Calendar belonging to Event',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Calendar)},
          },
        },
      },
    },
  })
  async getCalendar(
    @param.path.string('id') id: typeof Event.prototype.id,
  ): Promise<Calendar> {
    return this.eventRepository.calendar(id);
  }
}
