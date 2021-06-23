import {service} from '@loopback/core';
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
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, Event, EventAttendeeView} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {
  CalendarRepository,
  SubscriptionRepository,
  EventAttendeeViewRepository,
  EventRepository,
} from '../repositories';
import {ValidatorService} from '../services/validator.service';
import {ErrorKeys} from '../models/enums/error-keys';
import {CalendarEventService} from '../services';

const basePath = '/calendars/{id}/events';

export class CalendarEventController {
  constructor(
    @repository(CalendarRepository)
    protected calendarRepository: CalendarRepository,
    @repository(SubscriptionRepository)
    protected subscriptionRepository: SubscriptionRepository,
    @repository(EventAttendeeViewRepository)
    protected eventAttendeeViewRepository: EventAttendeeViewRepository,
    @repository(EventRepository)
    protected eventRepository: EventRepository,
    @service(ValidatorService) protected validatorService: ValidatorService,
    @service(CalendarEventService)
    protected calendarEventService: CalendarEventService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewEvent]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Calendar has many Event',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(Event)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<EventAttendeeView>,
    @param.query.dateTime('timeMax') timeMax?: Date,
    @param.query.dateTime('timeMin') timeMin?: Date,
  ): Promise<Event[]> {
    const calendarId = await this.validatorService.primaryToCalendarId(id);
    if (!calendarId) {
      throw new HttpErrors.NotFound(ErrorKeys.PrimaryCalendarNotExist);
    }
    const calendar = await this.validatorService.calendarExists(calendarId);
    if (!calendar) {
      throw new HttpErrors.NotFound(ErrorKeys.CalendarNotExist);
    }

    const correctTime = this.validatorService.minMaxTime(timeMin, timeMax);
    if (!correctTime) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.CanNotBeGreater);
    }
    const whereClause = this.calendarEventService.getWhereClause(
      timeMin,
      timeMax,
    );
    const subscription = await this.calendarEventService.primarySubscription(
      calendarId,
    );
    if (!subscription) {
      throw new HttpErrors.NotFound(ErrorKeys.SubscriptionNotExist);
    }
    const modifiedFilter = this.calendarEventService.getFilter(
      subscription.identifier,
      whereClause,
      filter,
    );
    const filterWhere: Filter<EventAttendeeView> = {
      where: modifiedFilter.where,
    };
    const events = await this.eventAttendeeViewRepository.find(filterWhere);

    const eventIds: string[] = [];
    events.forEach(event => {
      if (event.id) {
        eventIds.push(event.id);
      }
    });

    const eventFilter: Filter<Event> = {where: {id: {inq: eventIds}}};
    return this.eventRepository.find(eventFilter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateEvent]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Event)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Calendar.prototype.id,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Event, {
            title: 'NewEventInCalendar',
            exclude: ['id'],
            optional: ['calendarId'],
          }),
        },
      },
    })
    event: Omit<Event, 'id'>,
  ): Promise<Event> {
    return this.calendarRepository.events(id).create(event);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateEvent]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar.Event PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Event, {partial: true}),
        },
      },
    })
    event: Partial<Event>,
    @param.query.object('where', getWhereSchemaFor(Event)) where?: Where<Event>,
  ): Promise<Count> {
    return this.calendarRepository.events(id).patch(event, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteEvent]})
  @del(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar.Event DELETE success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Event)) where?: Where<Event>,
  ): Promise<Count> {
    return this.calendarRepository.events(id).delete(where);
  }
}
