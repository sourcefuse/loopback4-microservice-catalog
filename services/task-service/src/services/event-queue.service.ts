import {BindingScope, inject, injectable} from '@loopback/context';
import {EventQueueConnector, Event} from '../types';
import {asLifeCycleObserver} from '@loopback/core';
import {TaskServiceBindings} from '../keys';
import {EventModel} from '../models';
import {EventProcessorService} from './index';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  asLifeCycleObserver,
)
export class EventQueueService {
  constructor(
    @inject('config') private queueSettings: any,
    @inject(TaskServiceBindings.TASK_PROVIDER)
    private connector: EventQueueConnector,
    @inject('services.EventProcessorService')
    public eventProcessorService: EventProcessorService,
  ) {
    this.listenForEvents();
  }

  async enqueueEvent(event: Partial<EventModel>): Promise<void> {
    const connection = await this.connector.connect(this.connector.settings);
    const params = {
      MessageBody: JSON.stringify(event.payload),
      QueueUrl: process.env.AWS_QUEUE_URL,
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
    connection.onEvent((event: Event) => {
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
      try {
        const connection = await this.connector.connect(
          this.connector.settings,
        );
        const data = await connection.receiveMessage(receiveParams).promise();
        const messages = data.Messages;
        if (messages && messages.length) {
          for (const message of messages) {
            const event: Event = JSON.parse(message.Body || '{}');

            // Logic to process this event
            this.eventProcessorService.processEvent(event);

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
    console.log('Performing health check on event queue');
    const healthCheckResponse = await this.connector.ping();
    return healthCheckResponse;
  }
}
