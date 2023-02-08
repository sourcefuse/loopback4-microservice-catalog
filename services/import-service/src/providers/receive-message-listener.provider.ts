import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchRequestEntry,
  ReceiveMessageCommand,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import {BindingScope, inject, injectable, Provider} from '@loopback/core';
import {v4 as uuidv4} from 'uuid';
import {ImportServiceBindings} from '../keys';
import {ackQueueUrl, client, dataQueueUrl} from './send-message.provider';
import {MessageData, SaveDataFn} from './types';
export const fileCount = new Map<string, number>();
const maxCount = 10;

@injectable({scope: BindingScope.TRANSIENT})
export class ReceiveMessageListenerProvider implements Provider<() => void> {
  constructor(
    @inject(ImportServiceBindings.SaveDataProvider)
    private readonly saveData: SaveDataFn,
  ) {}

  value() {
    return () => this.receiveInvoker();
  }

  receiveInvoker() {
    let count = 0;
    setInterval(() => {
      if (
        count < maxCount
        // &&
        // count < Math.ceil(remainingMessages / batchSize) + 1
      ) {
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
        const recordData: MessageData = JSON.parse(message.Body as string);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.saveData(recordData);

        const count = (fileCount.get(fileId) ?? 0) + recordData.rows.length;
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      client.send(
        new DeleteMessageBatchCommand({
          Entries: deleteCommandReceiptHandle,
          QueueUrl: dataQueueUrl,
        }),
      );
      const count = fileCount.get(fileId);
      if (count === totalRows) {
        const input = {
          QueueUrl: ackQueueUrl,
          MessageBody: fileId,
        };
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        client.send(new SendMessageCommand(input));

        fileCount.set(fileId, 0);
      }
    }
  }
}
