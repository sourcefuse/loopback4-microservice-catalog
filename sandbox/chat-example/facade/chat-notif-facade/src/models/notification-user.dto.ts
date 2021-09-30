import {model, property, AnyObject} from '@loopback/repository';
import {BaseEntity} from '@sourceloop/core';

@model({
  name: 'notification_users',
  settings: {
    strict: false,
  },
})
export class NotificationUserDto extends BaseEntity {
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
    type: 'boolean',
    default: false,
    name: 'is_read',
  })
  isRead?: boolean;

  @property({
    type: 'object',
    required: false,
    name: 'action_meta',
  })
  actionMeta?: AnyObject;

  constructor(data?: Partial<NotificationUserDto>) {
    super(data);
  }
}
