import {service} from '@loopback/core';
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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Attachment, Attendee, Event, EventAttendeeView} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {EventDTO} from '../models/event.dto';
import {
  AttachmentRepository,
  AttendeeRepository,
  EventRepository,
  EventAttendeeViewRepository,
} from '../repositories';
import {ValidatorService} from '../services/validator.service';
import {ErrorKeys} from '../models/enums/error-keys';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {FreeBusyDTO} from '../models/free-busy.dto';
import {EventService} from '../services';

const basePath = '/events';

export class EventController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
    @repository(AttendeeRepository)
    public attendeeRepository: AttendeeRepository,
    @repository(AttachmentRepository)
    public attachmentRepository: AttachmentRepository,
    @repository(EventAttendeeViewRepository)
    public eventAttendeeViewRepository: EventAttendeeViewRepository,
    @service(ValidatorService) public validatorService: ValidatorService,
    @service(EventService) public eventService: EventService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateEvent]})
  @post(basePath, {
    description: `While an organizer creates an event, we get participants details along with it. 
      This api will check for slot availability of all the participants in that particular 
      time slot. If the slot is free the event will be created. Events can be scheduled on 
      behalf of someone else, In this case we will be saving the creator details 
      (generally the organiser is the creator themselves, so we will be keeping the organiser 
        and created_by the same).`,
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Event)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(EventDTO, {
            title: 'NewEvent',
            exclude: ['id'],
          }),
        },
      },
    })
    req: Omit<EventDTO, 'id'>,
  ): Promise<Event> {
    const {calendarId, parentEventId, attendees, attachments} = req;
    const isCalendar = await this.validatorService.calendarExists(calendarId);
    if (!isCalendar) {
      throw new HttpErrors.NotFound(ErrorKeys.CalendarNotExist);
    }

    if (parentEventId) {
      const isEvent = await this.validatorService.eventExists(parentEventId);
      if (!isEvent) {
        throw new HttpErrors.NotFound(ErrorKeys.EventNotExist);
      }
    }
    delete req.attendees;
    delete req.attachments;

    const event = await this.eventRepository.create(req);
    if (event?.id) {
      const eventId = event.id;
      if (attendees) {
        event.attendees = await Promise.all(
          attendees.map(async (attendee: Attendee) => {
            attendee.eventId = eventId;
            return this.eventRepository.attendees(eventId).create(attendee);
          }),
        );
      }
      if (attachments) {
        event.attachments = await Promise.all(
          attachments.map(async (attachment: Attachment) => {
            attachment.eventId = eventId;
            return this.eventRepository.attachments(eventId).create(attachment);
          }),
        );
      }
    }
    return event;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewEvent, PermissionKey.ViewAttendee],
  })
  @get('/events/freeBusy', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event model freeBusy',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Event)}},
      },
    },
  })
  async getFeeBusyStatus(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FreeBusyDTO, {
            title: 'FreeBusyRequest',
          }),
        },
      },
    })
    freeBusyDTO: FreeBusyDTO,
  ) {
    const {timeMin, timeMax} = freeBusyDTO;
    if (
      !this.eventService.validateDateForTimeZone(timeMin) ||
      !this.eventService.validateDateForTimeZone(timeMax) ||
      !this.validatorService.minMaxTime(timeMin, timeMax)
    ) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.DateInvalid);
    }

    const response = {
      timeMax,
      timeMin,
      calendars: {},
    };

    const calendars = [];
    for (const item of freeBusyDTO.items) {
      if (item.id) {
        const id = item.id;
        const busyDetailsObj = await this.eventService.getBusyDetails(
          item,
          timeMax,
          timeMin,
        );

        const calendar = {
          [id]: busyDetailsObj,
        };
        calendars.push(calendar);
      } else {
        throw new HttpErrors.UnprocessableEntity(ErrorKeys.IdNotExist);
      }
    }
    response.calendars = calendars;
    return response;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewEvent]})
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Event) where?: Where<Event>): Promise<Count> {
    return this.eventRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewEvent]})
  @get(basePath, {
    description:
      'This api will return the events data, based on the filter provided. Sending the data of participants will be optional and will depend on the query.',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Event model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Event, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(EventAttendeeView) filter?: Filter<EventAttendeeView>,
  ): Promise<Event[]> {
    const whereClause: Filter<EventAttendeeView> = {
      where: filter?.where ?? {},
    };

    const events = await this.eventAttendeeViewRepository.find(whereClause);

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
  @authorize({permissions: [PermissionKey.UpdateEvent]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Event, {partial: true}),
        },
      },
    })
    event: Event,
    @param.where(Event) where?: Where<Event>,
  ): Promise<Count> {
    return this.eventRepository.updateAll(event, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewEvent]})
  @get(`${basePath}/{id}`, {
    description:
      'This api will return events data based on the id. Sending the data of participants will be optional and will depend on the query.',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Event model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Event, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Event, {exclude: 'where'})
    filter?: FilterExcludingWhere<Event>,
  ): Promise<Event> {
    return this.eventRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateEvent]})
  @patch(`${basePath}/{id}`, {
    description:
      'This api will be responsible for making any updates on an event. This action is only allowed to the organizer or the admin(based on permission).',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Event PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Event, {partial: true}),
        },
      },
    })
    event: Event,
  ): Promise<void> {
    await this.eventRepository.updateById(id, event);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateEvent]})
  @put(`${basePath}/{id}`, {
    description:
      'This api will be responsible for making any updates on an event. This action is only allowed to the organizer or the admin(based on permission).',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Event PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() event: Event,
  ): Promise<void> {
    return this.eventRepository.replaceById(id, event);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteEvent]})
  @del(`${basePath}/{id}`, {
    description:
      'Api to delete the event based on id. The action is only allowed to the organiser or the admin(based on permission).',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Event DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    //Soft Delete
    await this.attachmentRepository.deleteAll({eventId: id});
    await this.attendeeRepository.deleteAll({eventId: id});
    await this.eventRepository.deleteById(id);
  }

  // api for hard delete event
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.HardDeleteEvent]})
  @del(`${basePath}/{id}/hard`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Event HARD DELETE success',
      },
    },
  })
  async hardDeleteById(@param.path.string('id') id: string): Promise<void> {
    //hard Delete
    await this.attachmentRepository.deleteAllHard({eventId: id});
    await this.attendeeRepository.deleteAllHard({eventId: id});
    await this.eventRepository.deleteByIdHard(id);
  }
}
