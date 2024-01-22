import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {WorkflowRepository} from '@sourceloop/bpmn-service';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../enums/permission-key.enum';
import {Event, EventWorkflow} from '../models';
import {EventRepository, EventWorkflowRepository} from '../repositories';

const baseUrl = '/events';

export class EventController {
  constructor(
    @repository(EventWorkflowRepository)
    private readonly eventWorkflowMapping: EventWorkflowRepository,
    @repository(EventRepository)
    private readonly eventRepository: EventRepository,
    @repository(WorkflowRepository)
    private readonly workflowRepository: WorkflowRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewEvent],
  })
  @get(baseUrl, {
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
  async find(@param.filter(Event) filter?: Filter<Event>) {
    return this.eventRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewEvent],
  })
  @get(`${baseUrl}/{id}`, {
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewEvent],
  })
  @get(`${baseUrl}/count`, {
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

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(`${baseUrl}/mapping`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async mapEventToWorkflow(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(EventWorkflow, {
            title: 'EventWorkflowMapping',
          }),
        },
      },
    })
    eventWorkflowMapping: Omit<EventWorkflow, 'id'>,
  ) {
    await this.eventWorkflowMapping.create(eventWorkflowMapping);
  }
}
