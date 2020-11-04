import {model, property, belongsTo} from '@loopback/repository';
import {BaseEntity} from '@sourceloop/core';
import {Notification} from './notification.model';

@model({
  name: 'notification_users',
})
export class NotificationUser extends BaseEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @belongsTo(
    () => Notification,
    {name: 'notification'},
    {
      name: 'notification_id',
      required: true,
    },
  )
  notificationId: string;

  @property({
    type: 'string',
    required: true,
    name: 'user_id',
  })
  userId: string;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_read',
  })
  isRead?: boolean;

  constructor(data?: Partial<NotificationUser>) {
    super(data);
  }
}

export interface NotificationUserRelations {
  notificaTION: Notification;
}

export type NotificationUserWithRelations = NotificationUser &
  NotificationUserRelations;
