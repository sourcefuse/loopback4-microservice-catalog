﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property, Entity} from '@loopback/repository';
import {Config, MessageType, MessageOptions} from 'loopback4-notifications';
import {PubNubReceiver} from 'loopback4-notifications/pubnub';

@model({
  name: 'notification_access',
})
export class NotificationAccess extends Entity implements Config {
  @property({
    type: 'object',
    description: 'this will contain the list of reciever to give access',
    required: true,
  })
  receiver: PubNubReceiver;

  @property({
    type: 'number',
    required: true,
  })
  type: MessageType;

  @property({
    type: 'object',
    description: 'this will contain the ttl property for now',
  })
  options?: MessageOptions;

  constructor(data?: Partial<NotificationAccess>) {
    super(data);
  }
}
