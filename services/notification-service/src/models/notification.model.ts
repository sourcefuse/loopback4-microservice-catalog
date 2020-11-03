import {Entity, model, property, hasMany} from '@loopback/repository';
import {
  Message,
  Receiver,
  MessageType,
  MessageOptions,
} from 'loopback4-notifications';
import {NotificationUser} from './notification-user.model';

@model({
  name: 'notifications',
})
export class Notification extends Entity implements Message {
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

  @hasMany(() => NotificationUser, {keyTo: 'notificationId'})
  notificationUsers: NotificationUser[];

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}

export interface NotificationRelations {
  notificationUsers: NotificationUser[];
}

export type NotificationWithRelations = Notification & NotificationRelations;
