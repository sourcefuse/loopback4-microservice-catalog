import {model, property, belongsTo, AnyObject} from '@loopback/repository';
import {BaseEntity} from '@sourceloop/core';
import {NotificationDto} from './notification.dto';

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

  @belongsTo(
    () => NotificationDto,
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

  @property({
    type: 'object',
    required: false,
    name: 'action_meta',
  })
  actionMeta?: AnyObject;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<NotificationUserDto>) {
    super(data);
  }
}
