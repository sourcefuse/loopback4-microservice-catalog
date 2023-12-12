import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SQS} from 'aws-sdk';
import {
  IEventAdapter,
  IEventStreamHandler,
  IIncomingConnector,
  IOutgoingConnector,
} from '../../interfaces';
import {IEvent} from '../../interfaces/i-event';
import {TaskServiceSQSModule} from './keys';
import {SQSConfig} from './types';

export class SqsStreamService<T>
  implements IIncomingConnector, IOutgoingConnector<T>
{
  constructor(
    @inject(TaskServiceSQSModule.CONFIG)
    private readonly settings: SQSConfig,
    @inject(TaskServiceSQSModule.ADAPTER)
    private readonly adapter: IEventAdapter<SQS.Message, IEvent>,
  ) {}
  private connection?: SQS;
  async subscribe(handler: IEventStreamHandler): Promise<void> {
    this.connection = new SQS({
      region: this.settings.region,
      accessKeyId: this.settings.accessKeyId,
      secretAccessKey: this.settings.secretAccessKey,
    });
    const queueUrl = this.settings.queueUrl;

    const receiveParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };
    const receiveMessages = async () => {
      if (!this.connection) return;
      try {
        const data = await this.connection
          ?.receiveMessage(receiveParams)
          .promise();
        const messages = data.Messages;
        if (messages?.length) {
          const messagePromises = messages.map(async (message: SQS.Message) => {
            await this.adapter.adaptTo(message).then(msg => handler(msg));
            await this.connection
              ?.deleteMessage({
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      receiveMessages();
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    receiveMessages();
  }

  async unsubscribe(): Promise<void> {
    this.connection = undefined;
  }

  async publish(message: T): Promise<void> {
    const params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: this.settings.queueUrl,
    };
    await this.connection!.sendMessage(params).promise();
  }
}
