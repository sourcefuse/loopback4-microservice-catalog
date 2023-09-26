import {BindingScope, inject, injectable} from '@loopback/context';
import {asLifeCycleObserver, service} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {TaskServiceBindings} from '../keys';
import {Event} from '../models';
import {EventQueueConnector, HealthResponse} from '../types';
import {EventProcessorService} from './event-processor.service';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  asLifeCycleObserver,
)
export class EventQueueServiceSQS {
  constructor(
    @service(EventProcessorService)
    private readonly eventProcessorService: EventProcessorService,
    @inject(TaskServiceBindings.CONNECTOR_CONFIG)
    private settings: AnyObject,
    @inject(TaskServiceBindings.TASK_PROVIDER)
    private connector: EventQueueConnector,
  ) {
    this.listenForEvents();
  }

  async enqueueEvent(event: Partial<Event>): Promise<void> {
    const connection = await this.connector.connect(this.connector.settings);
    const params = {
      MessageBody: JSON.stringify(event),
      QueueUrl: this.settings.queueUrl,
    };
    await connection.sendMessage(params, (err: AnyObject, data: AnyObject) => {
      if (err) {
        throw new HttpErrors.InternalServerError(
          `Error sending message: ${err.message}`,
        );
      }
    });
  }

  listenForEvents(): void {
    // Start listening to the queue for incoming events
    const queueUrl = this.connector.settings.queueUrl;

    const receiveParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };

    const receiveMessages = async () => {
      const connection = await this.connector.connect(this.connector.settings);
      try {
        const data = await connection.receiveMessage(receiveParams).promise();
        const messages = data.Messages;
        if (messages?.length) {
          const messagePromises = messages.map(async (message: AnyObject) => {
            const event: Event = JSON.parse(message.Body || '{}');

            // Logic to process this event
            await this.eventProcessorService.processEvent(event);

            // Delete the processed message from the queue
            await connection
              .deleteMessage({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle!,
              })
              .promise();
          });

          await Promise.all(messagePromises);
        }
      } catch (error) {
        throw new HttpErrors.InternalServerError(`Error with Queue, ${error}`);
      }
      // Call the function recursively to continuously listen for new messages
      receiveMessages();
    };

    // Start listening for events
    receiveMessages();
  }

  async healthCheck(): Promise<HealthResponse> {
    const healthCheckResponse = await this.connector.ping();
    return healthCheckResponse;
  }
}
