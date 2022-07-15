// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class Orders extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  totalAmount: number;

  @property({
    type: 'string',
    required: true,
  })
  currency: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'string',
    required: true,
  })
  paymentGatewayId: string;

  @property({
    type: 'string',
  })
  paymentmethod: string;

  @property({
    type: 'Object',
  })
  metaData?: Object;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line
  [prop: string]: any; //NOSONAR

  constructor(data?: Partial<Orders>) {
    super(data);
  }
}
