import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';


@model({
  settings: {
    mysql: {
      table: "contracts"
    }
  }
})
export class Contracts extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid()
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  contract_name: string;

  @property({
    type: 'boolean',
    default: false,
  })
  contract_uploaded?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  image_converted?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  ocr_converted?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  hocr_converted?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  created_by: string;

  @property({
    type: 'string',
    required: true,
  })
  modified_by: string;

  @property({
    type: 'date',
    default: new Date(),
  })
  created_on?: string;

  @property({
    type: 'date',
    default: new Date(),
  })
  modified_on?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted?: boolean;

  @property({
    type: 'string',
  })
  deleted_by?: string;

  @property({
    type: 'date'
  })
  deleted_on?: string;



  constructor(data?: Partial<Contracts>) {
    super(data);
  }
}

export interface ContractsRelations {
  // describe navigational properties here
}

export type ContractsWithRelations = Contracts & ContractsRelations;
