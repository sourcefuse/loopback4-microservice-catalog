/* eslint-disable @typescript-eslint/naming-convention */
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
  })
  amount_paid: number;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'date',
  })
  paid_date?: string;

  @property({
    type: 'string',
  })
  payment_gateway_id?: string;

  @property({
    type: 'string',
  })
  order_id?: string;

  @property({
    type: 'Object',
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: any;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Transactions>) {
    super(data);
  }
}

export interface TransactionsRelations {
  // describe navigational properties here
}

export type TransactionsWithRelations = Transactions & TransactionsRelations;
