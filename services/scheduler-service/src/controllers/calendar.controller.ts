import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, WorkingHour} from '../models';
import {CalendarDTO} from '../models/calendar.dto';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {CalendarRepository, WorkingHourRepository} from '../repositories';
import {STATUS_CODE, CONTENT_TYPE} from '@sourceloop/core';

const basePath = '/calendars';

export class CalendarController {
  constructor(
    @repository(CalendarRepository)
    public calendarRepository: CalendarRepository,
    @repository(WorkingHourRepository)
    public workingHourRepository: WorkingHourRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateCalendar])
  @post(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Calendar)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(CalendarDTO, {
            title: 'NewCalendar',
            exclude: ['id'],
          }),
        },
      },
    })
    calendarDTO: Omit<CalendarDTO, 'id'>,
  ): Promise<Calendar> {
    let workingHours: WorkingHour[] = [];
    if (calendarDTO.workingHours) {
      workingHours = calendarDTO.workingHours;
    }
    delete calendarDTO.workingHours;

    const response = await this.calendarRepository.create(calendarDTO);
    if (response.id) {
      const calendarId: string = response.id;
      if (workingHours) {
        response['workingHours'] = [];
        for (const workingHour of workingHours) {
          workingHour.calendarId = calendarId;
          const workigHourResp = await this.workingHourRepository.create(
            workingHour,
          );
          response.workingHours.push(workigHourResp);
        }
      }
    }
    return response;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewCalendar])
  @get(`${basePath}/count`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Calendar) where?: Where<Calendar>): Promise<Count> {
    return this.calendarRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewCalendar])
  @get(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Calendar model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Calendar, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Calendar) filter?: Filter<Calendar>,
  ): Promise<Calendar[]> {
    return this.calendarRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateCalendar])
  @patch(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Calendar, {partial: true}),
        },
      },
    })
    calendar: Calendar,
    @param.where(Calendar) where?: Where<Calendar>,
  ): Promise<Count> {
    return this.calendarRepository.updateAll(calendar, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewCalendar])
  @get(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Calendar, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Calendar, {exclude: 'where'})
    filter?: FilterExcludingWhere<Calendar>,
  ): Promise<Calendar> {
    return this.calendarRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateCalendar])
  @patch(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Calendar PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Calendar, {partial: true}),
        },
      },
    })
    calendar: Calendar,
  ): Promise<void> {
    await this.calendarRepository.updateById(id, calendar);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateCalendar])
  @put(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Calendar PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() calendar: Calendar,
  ): Promise<void> {
    await this.calendarRepository.replaceById(id, calendar);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteCalendar])
  @del(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Calendar DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.calendarRepository.deleteById(id);
  }
}
