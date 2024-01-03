import {model, property} from '@loopback/repository';
import {BaseEntity} from '@sourceloop/core';
import {MessageType} from 'loopback4-notifications';

@model({
  name: 'user_notification_settings',
  settings: {
    strict: false,
  },
})
export class UserNotificationSettings extends BaseEntity<UserNotificationSettings> {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'user_id',
  })
  userId: string;

  @property({
    type: 'date',
    required: true,
    name: 'sleep_start_time',
  })
  sleepStartTime: Date;

  @property({
    type: 'date',
    required: true,
    name: 'sleep_end_time',
  })
  sleepEndTime: Date;

  @property({
    type: 'number',
    name: 'notification_type',
    required: true,
  })
  type: MessageType;
}
