import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  getModelSchemaRef,
  param,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {
  authenticate,
  STRATEGY,
  AuthenticationBindings,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, WorkingHour, Subscription, IdentifierType} from '../models';
import {CalendarDTO} from '../models/calendar.dto';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {
  CalendarRepository,
  WorkingHourRepository,
  SubscriptionRepository,
} from '../repositories';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
  sourceloopPost,
  sourceloopGet,
  sourceloopPatch,
  sourceloopPut,
  sourceloopDelete,
} from '@sourceloop/core';
import {AccessRoleType} from '../models/enums/access-role.enum';
import {inject, service} from '@loopback/core';
import {SchedulerBindings} from '../keys';
import {ISchedulerConfig} from '../types';
import {ErrorKeys} from '../models/enums/error-keys';
import {CalendarService} from '../services/calendar.service';

const basePath = '/calendars';
const calendarModelInstance = 'Calendar model instance';

export class CalendarController {
  constructor(
    @repository(CalendarRepository)
    public calendarRepository: CalendarRepository,
    @repository(WorkingHourRepository)
    public workingHourRepository: WorkingHourRepository,
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
    @service(CalendarService) public calendarService: CalendarService,
    @inject(SchedulerBindings.Config, {
      optional: true,
    })
    private readonly schdulerConfig?: ISchedulerConfig,
  ) {}

  @sourceloopPost(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: calendarModelInstance,
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Calendar)}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateCalendar]})
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
    return this.calendarService.createCalendar(calendarDTO);
  }

  @sourceloopPost('/calendars/calendarSubscription', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: calendarModelInstance,
        content: {'application/json': {schema: getModelSchemaRef(CalendarDTO)}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateCalendar]})
  async createWithSubscription(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CalendarDTO, {
            title: 'NewCalendar',
            exclude: ['id'],
          }),
        },
      },
    })
    calendarDTO: Omit<CalendarDTO, 'id'>,
  ): Promise<CalendarDTO> {
    if (!calendarDTO.subscription) {
      throw new HttpErrors.NotFound(ErrorKeys.SubscriptionNotExist);
    }
    const subscription: Subscription = Object.assign(calendarDTO.subscription);

    delete calendarDTO.subscription;
    let response = await this.calendarService.createCalendar(calendarDTO);
    let identifierType = this.schdulerConfig?.identifierMappedTo;
    if (!identifierType) {
      identifierType = IdentifierType.Id;
    }

    let subscriptionIdentifier;
    if (subscription.identifier) {
      subscriptionIdentifier = subscription.identifier;
    } else {
      subscriptionIdentifier = this.currentUser[identifierType];
    }

    const where = {
      and: [{identifier: subscriptionIdentifier}, {isPrimary: true}],
    };

    const subscriptionList = await this.subscriptionRepository.find({where});
    if (subscriptionList.length > 0) {
      subscription.isPrimary = false;
    } else {
      subscription.isPrimary = true;
    }

    if (response.id) {
      subscription.calendarId = response.id;
      if (subscriptionIdentifier) {
        subscription.identifier = subscriptionIdentifier;
      } else {
        throw new HttpErrors.NotFound(ErrorKeys.SubscriptionIdentifierNotExist);
      }
      subscription.accessRole = AccessRoleType.Owner;
      const subscriptionResponse = await this.subscriptionRepository.create(
        subscription,
      );
      const calendarDTOResp: CalendarDTO = new CalendarDTO();
      calendarDTOResp.subscription = subscriptionResponse;
      response = Object.assign(calendarDTOResp, response);
    }
    return response;
  }

  @sourceloopGet(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewCalendar]})
  async count(@param.where(Calendar) where?: Where<Calendar>): Promise<Count> {
    return this.calendarRepository.count(where);
  }

  @sourceloopGet(basePath, {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewCalendar]})
  async find(
    @param.filter(Calendar) filter?: Filter<Calendar>,
  ): Promise<Calendar[]> {
    return this.calendarRepository.find(filter);
  }

  @sourceloopPatch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateCalendar]})
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

  @sourceloopGet(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: calendarModelInstance,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Calendar, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewCalendar]})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Calendar, {exclude: 'where'})
    filter?: FilterExcludingWhere<Calendar>,
  ): Promise<Calendar> {
    return this.calendarRepository.findById(id, filter);
  }

  @sourceloopPatch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Calendar PATCH success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateCalendar]})
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

  @sourceloopPut(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Calendar PUT success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateCalendar]})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() calendarDTO: CalendarDTO,
  ): Promise<void> {
    let workingHours: WorkingHour[] = [];
    if (calendarDTO.workingHours) {
      workingHours = calendarDTO.workingHours;
      await this.calendarService.checkPutValidations(workingHours, id);
      await this.calendarService.deleteWorkingHours(workingHours, id);

      const workingHoursToAdd: WorkingHour[] = [];
      for (const workingHour of workingHours) {
        if (workingHour.id === '') {
          workingHoursToAdd.push(workingHour);
          continue;
        }
        await this.workingHourRepository.replaceById(
          workingHour.id,
          workingHour,
        );
      }

      for (const workingHour of workingHoursToAdd) {
        delete workingHour.id;
        await this.workingHourRepository.create(workingHour);
      }
    }
    delete calendarDTO.workingHours;
    await this.calendarRepository.updateById(id, calendarDTO);
  }

  @sourceloopDelete(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Calendar DELETE success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteCalendar]})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.calendarRepository.deleteById(id);
  }
}
