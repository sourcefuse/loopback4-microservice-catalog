// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from '@sourceloop/core';
import {Notification} from './notification.model';

@model({
  name: 'notification_users',
  settings: {
    strict: false,
  },
})
export class NotificationUser extends BaseEntity<NotificationUser> {
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

  @property({
    type: 'object',
    required: false,
    name: 'action_meta',
  })
  actionMeta?: AnyObject;

  @property({
    type: 'boolean',
    default: false,
    name: 'is_draft',
  })
  isDraft?: boolean;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any; //NOSONAR
}

export interface NotificationUserRelations {
  notificaTION: Notification;
}

export type NotificationUserWithRelations = NotificationUser &
  NotificationUserRelations;
