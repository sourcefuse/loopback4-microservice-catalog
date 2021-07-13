import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  requestBody,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, WorkingHour} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {CalendarRepository} from '../repositories';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  sourceloopGet,
  sourceloopPost,
  sourceloopPatch,
  sourceloopDelete,
} from '@sourceloop/core';

const basePath = '/calendars/{id}/working-hours';

export class CalendarWorkingHourController {
  constructor(
    @repository(CalendarRepository)
    protected calendarRepository: CalendarRepository,
  ) {}

  @sourceloopGet(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Calendar has many WorkingHour',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(WorkingHour)},
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewWorkingHour]})
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<WorkingHour>,
  ): Promise<WorkingHour[]> {
    return this.calendarRepository.workingHours(id).find(filter);
  }

  @sourceloopPost(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(WorkingHour)},
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateWorkingHour]})
  async create(
    @param.path.string('id') id: typeof Calendar.prototype.id,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(WorkingHour, {
            title: 'NewWorkingHourInCalendar',
            exclude: ['id'],
            optional: ['calendarId'],
          }),
        },
      },
    })
    workingHour: Omit<WorkingHour, 'id'>,
  ): Promise<WorkingHour> {
    return this.calendarRepository.workingHours(id).create(workingHour);
  }

  @sourceloopPatch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar.WorkingHour PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateWorkingHour]})
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(WorkingHour, {partial: true}),
        },
      },
    })
    workingHour: Partial<WorkingHour>,
    @param.query.object('where', getWhereSchemaFor(WorkingHour))
    where?: Where<WorkingHour>,
  ): Promise<Count> {
    return this.calendarRepository.workingHours(id).patch(workingHour, where);
  }

  @sourceloopDelete(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar.WorkingHour DELETE success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteWorkingHour]})
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(WorkingHour))
    where?: Where<WorkingHour>,
  ): Promise<Count> {
    return this.calendarRepository.workingHours(id).delete(where);
  }
}
