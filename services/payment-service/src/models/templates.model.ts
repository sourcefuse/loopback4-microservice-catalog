import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Templates extends Entity {
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
    name: 'payment_gateway_id',
  })
  paymentGatewayId: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  template: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Templates>) {
    super(data);
  }
}

export type TemplatesWithRelations = Templates;
