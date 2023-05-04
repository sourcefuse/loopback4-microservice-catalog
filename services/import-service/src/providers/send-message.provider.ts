import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
  SQSClient,
} from '@aws-sdk/client-sqs';
import {BindingScope, injectable, Provider} from '@loopback/core';
import {v4 as uuidv4} from 'uuid';
import {MessageData} from '../types';

export const client = new SQSClient({region: process.env.AWS_REGION});
export const dataQueueUrl = process.env.DATA_QUEUE as string;

export const ackQueueUrl = process.env.ACKNOWLEDGE_QUEUE as string;

@injectable({scope: BindingScope.TRANSIENT})
export class SendMessageProvider
  implements Provider<(data: MessageData[][]) => Promise<void>>
{
  value() {
    return async (levelWiseBatches: MessageData[][]) =>
      this.sendMessageListener(levelWiseBatches);
  }

  async sendMessageListener(levelWiseBatch: MessageData[][]) {
    const fileId = uuidv4();

    let i = 0;
    console.time('importTime');
    while (i < levelWiseBatch.length) {
      let rows = 0;
      levelWiseBatch[i].forEach(message => {
        rows += message.rows.length;
      });
      if (levelWiseBatch[i].length) {
        this.sendMessage(levelWiseBatch[i], fileId, rows, i);
        // wait for ACK
        await this.waitForACK(fileId);
      }
      i++;
    }
  }

  async waitForACK(fileId: string) {
    const params = {
      AttributeNames: ['SentTimestamp'],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [],
      QueueUrl: ackQueueUrl,
      WaitTimeSeconds: 20,
    };
    const data = await client.send(new ReceiveMessageCommand(params));
    if (data.Messages) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < data.Messages.length; i++) {
        const receivedFileId = data.Messages[i].Body;
        if (receivedFileId === fileId) {
          //delete ack from queue
          const input = {
            QueueUrl: ackQueueUrl,
            ReceiptHandle: data.Messages[i].ReceiptHandle,
          };
          await client.send(new DeleteMessageCommand(input));
          return true;
        }
      }
    }
    await this.waitForACK(fileId);
  }
  sendMessage(
    data: MessageData[],
    fileId: string,
    count: number,
    level: number,
  ) {
    let group = 1;
    const inc = 10;
    for (let i = 0; i < data.length; i += inc) {
      const messageGroup = data.slice(i, i + inc);

      const params: {
        QueueUrl: string;
        Entries: SendMessageBatchRequestEntry[];
      } = {
        QueueUrl: dataQueueUrl,
        Entries: [],
      };

      messageGroup.forEach((message, index) => {
        // MAKE PARAMS CONFIGURABLE
        params.Entries.push({
          MessageAttributes: {
            FileId: {
              DataType: 'String',
              StringValue: fileId,
            },
            Level: {
              DataType: 'Number',
              StringValue: `${level}`,
            },
            Count: {
              DataType: 'Number',
              StringValue: `${count}`,
            },
          },
          MessageBody: JSON.stringify(message),
          Id: `file_${fileId}_level_${level}_group_${group}_message_${
            index + 1
          }`,
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      client.send(new SendMessageBatchCommand(params));
      group++;
    }
  }
}
