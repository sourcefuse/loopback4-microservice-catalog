import {BindingScope, inject, injectable} from '@loopback/context';
import {EventQueueConnector, Event} from '../types';
import {asLifeCycleObserver} from '@loopback/core';
import {SQSConnector} from '../providers';

@injectable(
  {
    scope: BindingScope.SINGLETON,
  },
  asLifeCycleObserver,
)
export class EventQueueService {
  private connector: EventQueueConnector;

  constructor(@inject('sqs.config') private sqsSettings: any) {
    this.connector = new SQSConnector('SQSConnector', this.sqsSettings);
  }

  async enqueueEvent(event: Event): Promise<void> {
    // Enqueue the event using the underlying event queue system
    // Implementation logic goes here
    console.log(`Enqueuing event: ${JSON.stringify(event)}`);
    // Example: enqueue event using the connector
    const connection = await this.connector.connect(this.connector.settings);
    console.log('Checking connenction', connection);
    // Example: enqueue the event using the connection
    // await connection.sendMessage('event');
    const params = {
      MessageBody: 'messageBody',
      QueueUrl: process.env.AWS_SQS_URL,
    };
    await connection.sendMessage(params, (err: any, data: any) => {
      if (err) {
        console.error('Error sending message:', err);
      } else {
        console.log('Message sent:', data.MessageId);
      }
    });
    // Disconnect from the underlying system (optional)
    console.log('All done');
  }

  async startListening(): Promise<void> {
    // Start listening to the event queue system for incoming events
    // Implementation logic goes here
    console.log('Start listening to event queue', this);
    // Example: connect to the event queue system
    const connection = await this.connector.connect(this.connector.settings);
    // Example: listen to incoming events using the connection
    connection.onEvent((event: Event) => {
      // Process the incoming event
      console.log(`Received event: ${JSON.stringify(event)}`);
      // Handle the event as needed
    });
  }

  async stopListening(): Promise<void> {
    // Stop listening to the event queue system
    // Implementation logic goes here
    console.log('Stop listening to event queue');
    // Example: disconnect from the event queue system
    await this.connector.disconnect(this.connector.settings);
  }

  async healthCheck(): Promise<any> {
    // Perform a health check on the event queue system
    // Implementation logic goes here
    console.log('Performing health check on event queue');
    // Example: perform health check using the connector
    const healthCheckResponse = await this.connector.ping();
    // Return the health check response
    return healthCheckResponse;
  }
}
