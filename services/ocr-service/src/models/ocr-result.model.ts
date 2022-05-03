import {Entity, model, property} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';


@model({
  settings: {
    mysql: {
      table: "ocr_results"
    }
  }
})
export class OcrResults extends Entity {
  @property({
    type: 'string',
    id: true,
    default: () => uuidv4()
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  contract_name?: string;

  @property({
    type: 'string',
  })
  clause_type?: string;

  @property({
    type: 'number',
  })
  page_number?: number | any;

  @property({
    type: 'string',
  })
  text?: string;

  @property({
    type: 'string',
  })
  coordinates?: string | any;

  @property({
    type: 'number',
  })
  confidence_level?: number;

  @property({
    type: 'string',
  })
  created_by?: string;

  @property({
    type: 'string',
  })
  modified_by?: string;

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


  constructor(data?: Partial<OcrResults>) {
    super(data);
  }
}

export interface OcrResultsRelations {
  // describe navigational properties here
}

export type OcrResultsWithRelations = OcrResults & OcrResultsRelations;
