import {hasMany, model, property} from '@loopback/repository';
import {Notification as SourceloopNotification} from '@sourceloop/notification-service';
import {Message} from 'loopback4-notifications';
import {NotificationUser} from './notification-user.model';
@model({
  name: 'notifications',
})
export class Notification extends SourceloopNotification implements Message {
  @property({
    type: 'number',
    required: true,
  })
  type: number;

  @hasMany(() => NotificationUser, {keyTo: 'notificationId'})
  notificationUsers: NotificationUser[];
}

export interface NotificationRelations {
  notificationUsers: NotificationUser[];
}

export type NotificationWithRelations = Notification & NotificationRelations;
