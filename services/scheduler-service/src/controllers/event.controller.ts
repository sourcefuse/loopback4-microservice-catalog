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
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateEvent])
  @post(basePath, {
    responses: {
      '200': {
        description: 'Event model instance',
        content: {'application/json': {schema: getModelSchemaRef(Event)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
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
    const isCalendar = await this.validatorService.calendarExists(
      calendarId,
    );
    if (!isCalendar) {
      throw new HttpErrors.NotFound(`Calendar does not exist`);
    }

    const isEvent = await this.validatorService.eventExists(parentEventId);
    if (!isEvent) {
      throw new HttpErrors.NotFound(`Event does not exist`);
    }

    delete req.attendees;
    delete req.attachments;

    const event = await this.eventRepository.create(req);
    if (event?.id) {
      const eventId = event.id;
      if (attendees){
        event.attendees = await Promise.all(
          attendees.map(async (attendee: Attendee) => {
            attendee.eventId = eventId;
            return this.eventRepository.attendees(eventId).create(attendee);
          }),
        );
      }
      if (attachments){
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
  @authorize([PermissionKey.ViewEvent])
  @get(`${basePath}/count`, {
    responses: {
      '200': {
        description: 'Event model count',
        content: {'application/json': {schema: CountSchema}},
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
      '200': {
        description: 'Array of Event model instances',
        content: {
          'application/json': {
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
      '200': {
        description: 'Event PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
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
      '200': {
        description: 'Event model instance',
        content: {
          'application/json': {
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
      '204': {
        description: 'Event PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
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
      '204': {
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
      throw new HttpErrors.NotFound(`Calendar does not exist`);
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
        if (!isEvent){
          throw new HttpErrors.NotFound(`Attendee has invalid eventId`);
        }
        await this.attendeeRepository.replaceById(attendee.id, attendee);
      }
    }
    if (attachments) {
      for (const attachment of attachments) {
        const isEvent = await this.validatorService.eventExists(
          attachment.eventId,
        );
        if (!isEvent){
          throw new HttpErrors.NotFound(`Attachment has invalid eventId`);
        }
        await this.attachmentRepository.replaceById(attachment.id, attachment);
      }
    }
    await this.eventRepository.replaceById(id, event);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteEvent])
  @del(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Event DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.eventRepository.deleteById(id);
  }
}
