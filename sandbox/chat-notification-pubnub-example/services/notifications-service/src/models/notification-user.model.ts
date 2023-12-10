import {model, property} from '@loopback/repository';
import {Notification} from './notification.model';
import {NotificationUser as SourceloopNotificationUser} from '@sourceloop/notification-service';
@model({
  name: 'notification_users',
  settings: {
    strict: false,
  },
})
export class NotificationUser extends SourceloopNotificationUser {
  @property({
    type: 'string',
    name: 'full_name',
  })
  fullName?: string;

  @property({
    type: 'string',
    required: true,
    name: 'tenant_id',
  })
  tenantId: string;

  @property({
    type: 'string',
    name: 'group_id',
  })
  groupId?: string;

  // Define well-known properties here
  // Indexer property to allow additional data
  constructor(data?: Partial<NotificationUser>) {
    super(data);
  }
}
export interface NotificationUserRelations {
  notificaTION: Notification;
}
export type NotificationUserWithRelations = NotificationUser &
  NotificationUserRelations;
