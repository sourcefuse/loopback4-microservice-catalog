// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class MetabaseToken extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    name: 'session_key',
  })
  sessionKey: string;

  @property({
    type: 'date',
    required: true,
    name: 'created_on',
  })
  createdOn: Date;

  @property({
    type: 'date',
    required: true,
    name: 'modified_on',
  })
  modifiedOn: Date;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any; //NOSONAR

  constructor(data?: Partial<MetabaseToken>) {
    super(data);
  }
}

export type MetabaseTokenWithRelations = MetabaseToken;
