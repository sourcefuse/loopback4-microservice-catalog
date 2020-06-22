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
import {Attachment, Attendee, Event} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {EventDTO} from '../models/event.dto';
import {
  AttachmentRepository,
  AttendeeRepository,
  EventRepository,
} from '../repositories';
import {ValidatorService} from '../services/validator.service';
import {ErrorKeys} from '../models/enums/error-keys';
import {STATUS_CODE, CONTENT_TYPE} from '@sourceloop/core';
import { FreeBusyDTO } from '../models/free-busy.dto';
import { EventService } from '../services';

const basePath = '/events';

export class EventController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
    @repository(AttendeeRepository)
    public attendeeRepository: AttendeeRepository,
    @repository(AttachmentRepository)
    public attachmentRepository: AttachmentRepository,
    @service(ValidatorService) public validatorService: ValidatorService,
    @service(EventService) public eventService: EventService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateEvent])
  @post(basePath, {
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
  @authorize([PermissionKey.ViewEvent, PermissionKey.ViewAttendee])
  @get('/events/freeBusy')
  async getFeeBusyStatus(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FreeBusyDTO, {
            title: 'FreeBusy request',
          }),
        },
      },
    })
    freeBusyDTO: FreeBusyDTO,
  ) {
    if (
      !this.eventService.validateDateForTimeZone(freeBusyDTO.timeMin) ||
      !this.eventService.validateDateForTimeZone(freeBusyDTO.timeMax) ||
      !this.validatorService.minMaxTime(
        freeBusyDTO.timeMin,
        freeBusyDTO.timeMax,
      )
    ) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.DateInvalid);
    }

    const response = {
      timeMax: freeBusyDTO.timeMax,
      timeMin: freeBusyDTO.timeMin,
      calendars: {},
    };

    const calendars = [];
    for (const item of freeBusyDTO.items) {
      const id = item.id;
      const busyDetailsObj = await this.eventService.getBusyDetails(
        item.id,
        freeBusyDTO.timeMax,
        freeBusyDTO.timeMin,
      );

      const calendar = {
        [id]: busyDetailsObj,
      };
      calendars.push(calendar);
    }
    response.calendars = calendars;
    return response;
  }
  
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewEvent])
  @get(`${basePath}/count`, {
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
  @authorize([PermissionKey.ViewEvent])
  @get(basePath, {
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
  async find(@param.filter(Event) filter?: Filter<Event>): Promise<Event[]> {
    return this.eventRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateEvent])
  @patch(basePath, {
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
  @authorize([PermissionKey.ViewEvent])
  @get(`${basePath}/{id}`, {
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
  @authorize([PermissionKey.UpdateEvent])
  @patch(`${basePath}/{id}`, {
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
  @authorize([PermissionKey.UpdateEvent])
  @put(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Event PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() event: EventDTO,
  ): Promise<void> {
    const isCalendar = await this.validatorService.calendarExists(
      event.calendarId,
    );
    if (!isCalendar) {
      throw new HttpErrors.NotFound(ErrorKeys.CalendarNotExist);
    }
    const {attendees, attachments} = event;
    delete event.attendees;
    delete event.attachments;

    await this.eventRepository.replaceById(id, event);

    if (attendees) {
      for (const attendee of attendees) {
        const isEvent = await this.validatorService.eventExists(
          attendee.eventId,
        );
        if (!isEvent) {
          throw new HttpErrors.NotFound(ErrorKeys.EventNotExist);
        }
        await this.attendeeRepository.replaceById(attendee.id, attendee);
      }
    }
    if (attachments) {
      for (const attachment of attachments) {
        const isEvent = await this.validatorService.eventExists(
          attachment.eventId,
        );
        if (!isEvent) {
          throw new HttpErrors.NotFound(ErrorKeys.EventNotExist);
        }
        await this.attachmentRepository.replaceById(attachment.id, attachment);
      }
    }
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteEvent])
  @del(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Event DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.eventRepository.deleteById(id);
  }
}
