import {Entity, model, property} from '@loopback/repository';
import {
  Message,
  Receiver,
  MessageType,
  MessageOptions,
} from 'loopback4-notifications';

@model({
  name: 'notifications',
})
export class NotificationDto extends Entity implements Message {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    jsonSchema: {
      nullable: true,
    },
  })
  subject?: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'object',
    required: true,
  })
  receiver: Receiver;

  @property({
    type: 'number',
    required: true,
  })
  type: MessageType;

  @property({
    type: 'date',
    name: 'sent',
  })
  sentDate: Date;

  @property({
    type: 'object',
  })
  options?: MessageOptions;

  constructor(data?: Partial<NotificationDto>) {
    super(data);
  }
}
