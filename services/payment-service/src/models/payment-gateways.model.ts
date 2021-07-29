import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PaymentGateways extends Entity {
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
  })
  // eslint-disable-next-line
  gateway_type: string;

  @property({
    type: 'boolean',
    required: true,
  })
  enabled: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PaymentGateways>) {
    super(data);
  }
}

export interface PaymentGatewaysRelations {
  // describe navigational properties here
}

export type PaymentGatewaysWithRelations = PaymentGateways &
  PaymentGatewaysRelations;
