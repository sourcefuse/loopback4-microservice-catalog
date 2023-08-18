import {BindingScope, inject, injectable} from '@loopback/context';
import {EventQueueConnector} from '../types';
import {asLifeCycleObserver, service} from '@loopback/core';
import {TaskServiceBindings} from '../keys';
import {Events} from '../models';
import {EventProcessorService} from './index';
import {AnyObject} from '@loopback/repository';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  asLifeCycleObserver,
)
export class EventQueueService {
  constructor(
    @inject(TaskServiceBindings.CONNECTOR_CONFIG)
    private settings: AnyObject,
    @inject(TaskServiceBindings.TASK_PROVIDER)
    private connector: EventQueueConnector,
    @service(EventProcessorService)
    public eventProcessorService: EventProcessorService,
  ) {
    this.listenForEvents();
  }

  async enqueueEvent(event: Partial<Events>): Promise<void> {
    const connection = await this.connector.connect(this.connector.settings);
    const params = {
      MessageBody: JSON.stringify(event),
      QueueUrl: this.settings.queueUrl,
    };
    await connection.sendMessage(params, (err: any, data: any) => {
      if (err) {
        console.error('Error sending message:', err);
      } else {
        console.log('Message sent:', data.MessageId);
      }
    });
    // Todo: Disconnect from the underlying system (optional)
  }

  async startListening(): Promise<void> {
    const connection = await this.connector.connect(this.connector.settings);
    connection.onEvent((event: Events) => {
      console.log(`Received event: ${JSON.stringify(event)}`);
    });
  }

  async stopListening(): Promise<void> {
    await this.connector.disconnect(this.connector.settings);
  }

  listenForEvents(): void {
    // Start listening to the SQS queue for incoming events
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
        if (messages && messages.length) {
          for (const message of messages) {
            const event: Events = JSON.parse(message.Body || '{}');

            // Logic to process this event
            await this.eventProcessorService.processEvent(event);

            // Delete the processed message from the SQS queue
            await connection
              .deleteMessage({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle!,
              })
              .promise();
          }
        }
      } catch (error) {
        console.error('Error receiving message from SQS:', error);
      }
      // Call the function recursively to continuously listen for new messages
      receiveMessages();
    };

    // Start listening for events
    receiveMessages();
  }

  async healthCheck(): Promise<any> {
    const healthCheckResponse = await this.connector.ping();
    return healthCheckResponse;
  }
}
