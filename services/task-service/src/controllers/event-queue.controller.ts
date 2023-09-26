import {inject} from '@loopback/core';
import {
  HttpErrors,
  get,
  getModelSchemaRef,
  post,
  requestBody,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../enums/permission-key.enum';
import {Event} from '../models';
import {EventQueueServiceSQS} from '../services/event-queue.service';
import {HealthResponse} from '../types';

const baseUrl = '/event-queue';

export class EventQueueController {
  constructor(
    @inject('services.EventQueueServiceSQS')
    private eventQueueService: EventQueueServiceSQS,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [TaskPermssionKey.AddToQueue]})
  @post(`${baseUrl}/enqueue`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Enque model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Event)},
        },
      },
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Event enqueued successfully',
      },
      [STATUS_CODE.INTERNAL_SERVER_ERROR]: {
        description: 'Failed to enqueue event',
      },
    },
  })
  async enqueueEvent(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Event, {
            title: 'Event',
          }),
        },
      },
    })
    event: Omit<Event, 'id'>,
  ): Promise<void> {
    try {
      await this.eventQueueService.enqueueEvent(event);
    } catch (error) {
      throw new HttpErrors.InternalServerError('Failed to enqueue event');
    }
  }

  @authorize({permissions: ['*']})
  @get(`${baseUrl}/ping`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Health check response',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
            },
          },
        },
      },
      [STATUS_CODE.INTERNAL_SERVER_ERROR]: {
        description: 'Failed to perform health check',
      },
    },
  })
  async healthCheck(): Promise<HealthResponse> {
    try {
      const healthCheckResponse = await this.eventQueueService.healthCheck();
      return healthCheckResponse;
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        'Failed to perform health check',
      );
    }
  }
}
