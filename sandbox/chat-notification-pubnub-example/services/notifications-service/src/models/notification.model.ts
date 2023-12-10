import {model, property, hasMany} from '@loopback/repository';
import {Message} from 'loopback4-notifications';
import {NotificationUser} from './notification-user.model';
import {Notification as SourceloopNotification} from '@sourceloop/notification-service';
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

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}

export interface NotificationRelations {
  notificationUsers: NotificationUser[];
}

export type NotificationWithRelations = Notification & NotificationRelations;
