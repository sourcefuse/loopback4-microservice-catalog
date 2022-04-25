import {Entity, model, property} from '@loopback/repository';
import {v4 as uuid} from 'uuid';


@model({
  settings: {
    mysql: {
      table: "hocr_results"
    }
  }
})
export class HocrResults extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: () => uuid()
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  contract_name: string;

  @property({
    type: 'number',
    required: true,
  })
  page_no: number;

  @property({
    type: 'string',
  })
  hocr_data?: Array<string>;

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


  constructor(data?: Partial<HocrResults>) {
    super(data);
  }
}

export interface HocrResultsRelations {
  // describe navigational properties here
}

export type HocrResultsWithRelations = HocrResults & HocrResultsRelations;
