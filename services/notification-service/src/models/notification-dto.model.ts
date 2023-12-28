// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, Model, property} from '@loopback/repository';
import {MessageOptions, MessageType, Receiver} from 'loopback4-notifications';

@model()
export class NotificationDto extends Model {
  @property({
    type: 'string',
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
    required: false,
  })
  body?: string;

  @property({
    type: 'object',
    required: false,
  })
  receiver?: Receiver;

  @property({
    type: 'boolean',
    required: false,
  })
  isCritical?: boolean;

  @property({
    type: 'number',
    required: true,
  })
  type: MessageType;

  @property({
    name: 'group_key',
  })
  groupKey?: string;

  @property({
    type: 'object',
  })
  options?: MessageOptions;

  @property({
    type: 'date',
    name: 'sent',
  })
  sentDate: Date;

  constructor(data?: Partial<NotificationDto>) {
    //Constructor for model NotificationSettingsDto
    super(data);
  }
}
