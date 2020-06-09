import {model, property} from '@loopback/repository';
import {BaseEntity} from '@sourceloop/core';

@model({
  name: 'notification_users',
})
export class NotificationUser extends BaseEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'notification_id',
  })
  notificationId: string;

  @property({
    type: 'string',
    required: true,
    name: 'user_id',
  })
  userId: string;

  @property({
    type: 'boolean',
    required: true,
    name: 'is_read',
  })
  isRead: boolean;

  constructor(data?: Partial<NotificationUser>) {
    super(data);
  }
}
