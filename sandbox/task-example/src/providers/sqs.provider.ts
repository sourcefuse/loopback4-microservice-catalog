import {BindingScope, Provider, inject, injectable} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {
  EventQueueConnector,
  HealthResponse,
  TaskServiceBindings,
} from '@sourceloop/task-service';
import {SQS} from 'aws-sdk';

@injectable({
  scope: BindingScope.SINGLETON,
})
export class SQSConnector implements Provider<EventQueueConnector> {
  sqs: SQS;
  isListening: boolean;

  constructor(
    @inject(TaskServiceBindings.CONNECTOR_NAME) public name: string,
    @inject(TaskServiceBindings.CONNECTOR_CONFIG) public settings: AnyObject,
  ) {
    this.sqs = new SQS({
      region: settings.region,
      accessKeyId: settings.accessKeyId,
      secretAccessKey: settings.secretAccessKey,
    });
  }

  value(): Promise<EventQueueConnector> {
    return Promise.resolve(this);
  }

  async connect(settings: AnyObject): Promise<SQS> {
    // Connection logic goes here
    return this.sqs;
  }

  async disconnect(settings: AnyObject): Promise<void> {
    // Disconnection logic goes here
    // Note: Since the SQS instance is created per request, you might not need to disconnect explicitly.
  }

  async ping(): Promise<HealthResponse> {
    // Health check logic goes here
    const queueUrl = this.settings.queueUrl;
    const response = await this.sqs
      .getQueueAttributes({
        QueueUrl: queueUrl,
        AttributeNames: ['All'],
      })
      .promise();
    const healthResponse: HealthResponse = {
      greeting: response.Attributes!.greeting,
      date: response.Attributes!.date,
      url: response.Attributes!.url,
      headers: {},
    };
    return healthResponse;
  }
}
