import {inject, Provider} from '@loopback/core';
import {EventQueueConnector} from '../types';
import {SQS} from 'aws-sdk';

export class SQSConnector implements Provider<EventQueueConnector> {
  name: string;
  settings: any;
  sqs: SQS;

  constructor(name: string, @inject('sqs.config') settings: any) {
    this.name = name;
    this.settings = settings;
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
