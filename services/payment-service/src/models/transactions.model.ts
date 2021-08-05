import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Transactions extends Entity {
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
    name: 'amount_paid',
  })
  amountPaid: number;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'date',
    name: 'paid_date',
  })
  paidDate?: string;

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
  res: any;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line
  [prop: string]: any;

  constructor(data?: Partial<Transactions>) {
    super(data);
  }
}
