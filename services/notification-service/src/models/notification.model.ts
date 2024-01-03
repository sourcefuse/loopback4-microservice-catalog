// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {hasMany, model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';
import {
  Message,
  MessageOptions,
  MessageType,
  Receiver,
} from 'loopback4-notifications';
import {NotificationUser} from './notification-user.model';

@model({
  name: 'notifications',
})
export class Notification extends CoreEntity<Notification> implements Message {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    jsonSchema: {
      nullable: true,
    },
  })
  subject?: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'object',
    required: false,
  })
  receiver: Receiver;

  @property({
    type: 'number',
    required: true,
  })
  type: MessageType;

  @property({
    type: 'date',
    name: 'sent',
  })
  sentDate: Date;

  @property({
    type: 'object',
  })
  options?: MessageOptions;

  @property({
    name: 'is_draft',
  })
  isDraft?: boolean;

  @property({
    name: 'group_key',
  })
  groupKey?: string;

  @property({
    type: 'boolean',
    name: 'is_critical',
  })
  isCritical?: boolean;

  @hasMany(() => NotificationUser, {keyTo: 'notificationId'})
  notificationUsers: NotificationUser[];
}

export interface NotificationRelations {
  notificationUsers: NotificationUser[];
}

export type NotificationWithRelations = Notification & NotificationRelations;
