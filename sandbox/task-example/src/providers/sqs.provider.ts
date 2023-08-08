import {inject, Provider, injectable, BindingScope} from '@loopback/core';
import {EventQueueConnector} from '@sourceloop/task-service';
import {SQS} from 'aws-sdk';

interface SQSEvent {
  MessageId: string;
  ReceiptHandle: string;
  MD5OfBody: string;
  Body: string;
}

@injectable({
  scope: BindingScope.SINGLETON,
})
export class SQSConnector implements Provider<EventQueueConnector> {
  sqs: SQS;
  isListening: boolean;

  constructor(
    @inject('name') public name: string,
    @inject('config') public settings: any,
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

  async connect(settings: any): Promise<SQS> {
    // Connection logic goes here
    return this.sqs;
  }

  async disconnect(settings: any): Promise<void> {
    // Disconnection logic goes here
    // Note: Since the SQS instance is created per request, you might not need to disconnect explicitly.
  }

  async ping(): Promise<any> {
    // Health check logic goes here
    const queueUrl = this.settings.queueUrl;
    const response = await this.sqs
      .getQueueAttributes({
        QueueUrl: queueUrl,
        AttributeNames: ['All'],
      })
      .promise();
    return response;
  }
}
