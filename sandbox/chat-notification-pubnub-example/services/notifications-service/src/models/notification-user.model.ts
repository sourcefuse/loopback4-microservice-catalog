import {model, property} from '@loopback/repository';
import {NotificationUser as SourceloopNotificationUser} from '@sourceloop/notification-service';
import {Notification} from './notification.model';
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
}
export interface NotificationUserRelations {
  notificaTION: Notification;
}
export type NotificationUserWithRelations = NotificationUser &
  NotificationUserRelations;
