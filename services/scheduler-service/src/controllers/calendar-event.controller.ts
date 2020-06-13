import {inject, service} from '@loopback/core';
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
  IAuthUserWithPermissions,
  STATUS_CODE,
  CONTENT_TYPE,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, Event} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {CalendarRepository, SubscriptionRepository} from '../repositories';
import {ValidatorService} from '../services/validator.service';
import {ErrorKeys} from '../models/enums/error-keys';

const basePath = '/calendars/{id}/events';

export class CalendarEventController {
  constructor(
    @repository(CalendarRepository)
    protected calendarRepository: CalendarRepository,
    @repository(SubscriptionRepository)
    protected subscriptionRepository: SubscriptionRepository,
    @service(ValidatorService) public validatorService: ValidatorService,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewEvent])
  @get(basePath, {
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
    @param.query.object('filter') filter?: Filter<Event>,
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
    let whereClause = {};

    if (timeMin && timeMax) {
      whereClause = {
        or: [
          {startDateTime: {between: [timeMin, timeMax]}},
          {endDateTime: {between: [timeMin, timeMax]}},
          {
            and: [
              {startDateTime: {lte: timeMin}},
              {endDateTime: {gte: timeMax}},
            ],
          },
        ],
      };
    } else {
      if (timeMin) {
        whereClause = {endDateTime: {gte: timeMin}};
      }

      if (timeMax) {
        whereClause = {startDateTime: {lte: timeMax}};
      }
    }

    return this.calendarRepository.events(calendarId).find({
      include: [{relation: 'attachments'}, {relation: 'attendees'}],
      where: whereClause,
    });
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateEvent])
  @post(basePath, {
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
  @authorize([PermissionKey.UpdateEvent])
  @patch(basePath, {
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
  @authorize([PermissionKey.DeleteEvent])
  @del(basePath, {
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
