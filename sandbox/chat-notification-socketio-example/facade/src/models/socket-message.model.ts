// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class SocketMessage extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  subject?: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  @property({
    type: 'string',
    required: true,
  })
  toUserId?: string;

  @property({
    type: 'string',
    required: true,
  })
  channelId: string;

  @property({
    type: 'string',
    required: true,
  })
  channelType: string;

  @property({
    type: 'string',
  })
  createdBy?: string;

  constructor(data?: Partial<SocketMessage>) {
    super(data);
  }
}
