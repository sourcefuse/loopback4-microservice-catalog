// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model({
  name: 'transactions',
  settings: {strict: true},
})
export class Transactions extends CoreEntity<Transactions> {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
    name: 'amount_paid',
  })
  amountPaid: number;

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
    type: 'date',
    name: 'paid_date',
  })
  paidDate?: Date;

  @property({
    type: 'string',
    name: 'payment_gateway_id',
  })
  paymentGatewayId?: string;

  @property({
    type: 'string',
    name: 'order_id',
  })
  orderId?: string;

  @property({
    type: 'Object',
  })
  // eslint-disable-next-line
  res: any; //NOSONAR

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line
  [prop: string]: any; //NOSONAR
}
