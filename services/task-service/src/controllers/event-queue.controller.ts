import {
  post,
  get,
  requestBody,
  HttpErrors,
  getModelSchemaRef,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {EventQueueService} from '../services/event-queue.service';
import {STATUS_CODE, CONTENT_TYPE} from '@sourceloop/core';
import {Event} from '../models';
import {authorize} from 'loopback4-authorization';
import {AnyObject} from '@loopback/repository';

const baseUrl = '/event-queue';

export class EventQueueController {
  constructor(
    @inject('services.EventQueueService')
    private eventQueueService: EventQueueService,
  ) {}

  @authorize({permissions: ['*']})
  @post(`${baseUrl}/enqueue-event`, {
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
    Event: Omit<Event, 'id'>,
  ): Promise<void> {
    try {
      await this.eventQueueService.enqueueEvent(Event);
    } catch (error) {
      throw new HttpErrors.InternalServerError('Failed to enqueue event');
    }
  }

  @get(`${baseUrl}/start-listening`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Started listening to events',
      },
      [STATUS_CODE.INTERNAL_SERVER_ERROR]: {
        description: 'Failed to start listening to events',
      },
    },
  })
  async startListening(): Promise<void> {
    try {
      await this.eventQueueService.startListening();
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        'Failed to start listening to events',
      );
    }
  }

  @get(`${baseUrl}/stop-listening`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Stopped listening to events',
      },
      [STATUS_CODE.INTERNAL_SERVER_ERROR]: {
        description: 'Failed to stop listening to events',
      },
    },
  })
  async stopListening(): Promise<void> {
    try {
      await this.eventQueueService.stopListening();
    } catch (error) {
      throw new HttpErrors.InternalServerError(
        'Failed to stop listening to events',
      );
    }
  }

  @get(`${baseUrl}/health-check`, {
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
  async healthCheck(): Promise<AnyObject> {
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
