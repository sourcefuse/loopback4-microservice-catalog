// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model({
  name: 'paymentgateways',
  settings: {strict: true},
})
export class PaymentGateways extends CoreEntity<PaymentGateways> {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    name: 'gateway_type',
  })
  gatewayType: string;

  @property({
    type: 'boolean',
    required: true,
  })
  enabled: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line
  [prop: string]: any; //NOSONAR
}
