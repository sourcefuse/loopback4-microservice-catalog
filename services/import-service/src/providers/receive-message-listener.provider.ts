import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchRequestEntry,
  ReceiveMessageCommand,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {v4 as uuidv4} from 'uuid';
import {ImportServiceBindings} from '../keys';
import {client} from './send-message.provider';
import {MessageData, SaveUserDataFn} from './types';
export const fileCount = new Map<string, number>();
const maxCount = 10;
export const dataQueueUrl = process.env.DATA_QUEUE as string;
export const ackQueueUrl = process.env.ACKNOWLEDGE_QUEUE as string;

@injectable({scope: BindingScope.TRANSIENT})
export class ReceiveMessageListenerProvider implements Provider<() => void> {
  constructor(
    @inject(ImportServiceBindings.SaveUserDataProvider)
    private readonly saveUserData: SaveUserDataFn,
  ) {}

  value() {
    return () => this.receiveMessageListener();
  }

  receiveInvoker() {
    let count = 0;
    setInterval(() => {
      if (count < maxCount) {
        count++;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.receiveMessageListener().then(() => {
          count--;
        });
      }
    }, 0);
  }

  async receiveMessageListener() {
    const params = {
      AttributeNames: [],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: dataQueueUrl,
      WaitTimeSeconds: 20,
    };
    const data = await client.send(new ReceiveMessageCommand(params));
    if (data.Messages) {
      const fileId = data.Messages[0].MessageAttributes?.FileId
        .StringValue as string;
      const totalRows = parseInt(
        data.Messages[0].MessageAttributes?.Count.StringValue as string,
      );
      data.Messages.forEach(message => {
        const userData: MessageData = JSON.parse(message.Body as string);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.saveUserData(userData);

        const count = (fileCount.get(fileId) ?? 0) + userData.rows.length;
        fileCount.set(fileId, count);
      });

      const deleteCommandReceiptHandle: DeleteMessageBatchRequestEntry[] = [];
      data.Messages?.forEach(message => {
        const id = uuidv4();
        deleteCommandReceiptHandle.push({
          Id: `${id}`,
          ReceiptHandle: message.ReceiptHandle,
        });
      });
      try {
        await client.send(
          new DeleteMessageBatchCommand({
            Entries: deleteCommandReceiptHandle,
            QueueUrl: dataQueueUrl,
          }),
        );
      } catch (err) {
        throw new Error(`Error: ${err}`);
      }
      const count = fileCount.get(fileId);
      if (count === totalRows) {
        const input = {
          QueueUrl: ackQueueUrl,
          MessageBody: fileId,
        };

        try {
          await client.send(new SendMessageCommand(input));
        } catch (err) {
          throw new Error(`Error: ${err}`);
        }
        fileCount.set(fileId, 0);
      }
    }
  }
}
