import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, WorkingHour} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {WorkingHourRepository} from '../repositories';

const basePath = '/working-hours/{id}/calendar';

export class WorkingHourCalendarController {
  constructor(
    @repository(WorkingHourRepository)
    public workingHourRepository: WorkingHourRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewCalendar])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Calendar belonging to WorkingHour',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Calendar)},
          },
        },
      },
    },
  })
  async getCalendar(
    @param.path.string('id') id: typeof WorkingHour.prototype.id,
  ): Promise<Calendar> {
    return this.workingHourRepository.calendar(id);
  }
}
