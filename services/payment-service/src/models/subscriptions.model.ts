// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Subscriptions extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'number',
    required: true,
    name: 'total_amount',
  })
  totalAmount: number;

  @property({
    type: 'string',
  })
  currency?: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'string',
    name: 'payment_gateway_id',
  })
  paymentGatewayId?: string;

  @property({
    type: 'string',
    name: 'payment_method',
  })
  paymentMethod?: string;

  @property({
    type: 'Object',
  })
  metaData?: Object;

  @property({
    type: 'date',
    name: 'start_date',
  })
  startDate?: Date;

  @property({
    type: 'date',
    name: 'end_date',
  })
  endDate?: Date;

  @property({
    type: 'string',
    name: 'gateway_subscription_id',
  })
  gatewaySubscriptionId?: string;

  @property({
    type: 'string',
    name: 'plan_id',
  })
  planId?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any; //NOSONAR

  constructor(data?: Partial<Subscriptions>) {
    super(data);
  }
}
