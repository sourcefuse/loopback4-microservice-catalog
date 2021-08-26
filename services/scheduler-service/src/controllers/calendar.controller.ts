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

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateCalendar]})
  @post(basePath, {
    description: `This is an api to create a calendar for any user. 
      Recommendation: Use this while adding a user to the main application, in order to create 
      a primary calendar for that particular user.`,
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: calendarModelInstance,
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
    return this.calendarService.createCalendar(calendarDTO);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateCalendar]})
  @post('/calendars/calendarSubscription', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: calendarModelInstance,
        content: {'application/json': {schema: getModelSchemaRef(CalendarDTO)}},
      },
    },
  })
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

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewCalendar]})
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionKey.ViewCalendar]})
  @get(basePath, {
    description:
      'These requests will be available to everyone in the event to look at.',
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
  async find(
    @param.filter(Calendar) filter?: Filter<Calendar>,
  ): Promise<Calendar[]> {
    return this.calendarRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateCalendar]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionKey.ViewCalendar]})
  @get(`${basePath}/{id}`, {
    description:
      'These requests will be available to everyone in the event to look at.',
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
  @authorize({permissions: [PermissionKey.UpdateCalendar]})
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionKey.UpdateCalendar]})
  @put(`${basePath}/{id}`, {
    description: `This api is to update the calendar by passing an id. This action will be allowed only to 
      the owner of the calendar or the admin. To identify the ‘owner’ we will check for the email 
      passed in the token and the corresponding access level, whereas to identify the admin we will 
      check for the permission.`,
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Calendar PUT success',
      },
    },
  })
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

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteCalendar]})
  @del(`${basePath}/{id}`, {
    description: `This api is to update the calendar by passing an id. This action will be allowed only to the 
      owner of the calendar or the admin. To identify the ‘owner’ we will check for the email 
      passed in the token and the corresponding access level, whereas to identify the admin we will 
      check for the permission.`,
    security: OPERATION_SECURITY_SPEC,
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
