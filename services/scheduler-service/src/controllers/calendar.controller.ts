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
import {authenticate, STRATEGY, AuthenticationBindings} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, WorkingHour, Subscription, IdentifierType} from '../models';
import {CalendarDTO} from '../models/calendar.dto';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {CalendarRepository, WorkingHourRepository, SubscriptionRepository} from '../repositories';
import {STATUS_CODE, CONTENT_TYPE, IAuthUserWithPermissions} from '@sourceloop/core';
import { AccessRoleType } from '../models/enums/access-role.enum';
import { inject, service } from '@loopback/core';
import { SchedulerBindings } from '../keys';
import { ISchedulerConfig } from '../types';
import { ErrorKeys } from '../models/enums/error-keys';
import { CalendarService } from '../services/calendar.service';

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
    private readonly schdulerConfig?: ISchedulerConfig
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateCalendar])
  @post(basePath, {
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
    return this.createCalendar(calendarDTO);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateCalendar])
  @post('/calendars/calendarSubscription', {
    responses: {
      '200': {
        description: calendarModelInstance,
        content: {'application/json': {schema: getModelSchemaRef(CalendarDTO)}},
      },
    },
  })
  async createWithSubscrription(
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
    if(!calendarDTO.subscription){
      throw new HttpErrors.NotFound(ErrorKeys.SubscriptionNotExist);
    }
    let subscription: Subscription = new Subscription();
    if (calendarDTO.subscription) {
      subscription = Object.assign(calendarDTO.subscription);
    }
    delete calendarDTO.subscription;
    let response = await this.createCalendar(calendarDTO);

    let identifierType = this.schdulerConfig?.identifierMappedTo;
    if (!identifierType){
      identifierType = IdentifierType.Id;
    }
    
    const subscriptionList = await this.subscriptionRepository.find({
      where: {
        identifier: this.currentUser[identifierType],
      },
    });

    if (subscriptionList.length > 0) {
      subscription.isPrimary = false;
    } else {
      subscription.isPrimary = true;
    }
    if(response.id){
      subscription.calendarId = response.id;
      subscription.identifier = calendarDTO.identifier;
      subscription.accessRole = AccessRoleType.Owner;
      const subscriptionResponse = await this.subscriptionRepository.create(subscription);
      const calendarDTOResp: CalendarDTO = new CalendarDTO();
      calendarDTOResp.subscription = subscriptionResponse;
      response = Object.assign(calendarDTOResp, response);
    }
    return response;
  }
  
  async createCalendar(calendarDTO: CalendarDTO){
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
    @requestBody() calendarDTO: CalendarDTO,
  ): Promise<void> {
    let workingHours: WorkingHour[] = [];
    if (calendarDTO.workingHours) {
      workingHours = calendarDTO.workingHours;
      await this.calendarService.checkPutValidations(workingHours, id);
      await this.calendarService.deleteWorkingHours(workingHours, id);
      
      const workingHoursToAdd: WorkingHour[] = [];
      for (const workingHour of workingHours) {
        if(workingHour.id === ""){
          workingHoursToAdd.push(workingHour);
          continue;
        }
        await this.workingHourRepository.replaceById(
          workingHour.id,
          workingHour,
        );
      }

      for(const workingHour of workingHoursToAdd){
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
