import { model, property } from '@loopback/repository';
import { BaseEntity } from '@sourceloop/core';
@model({
  name: 'ocr_results',
  settings: {
    strict: false,
  },
})
export class OcrResults extends BaseEntity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'contract_name',
  })
  contractName?: string;

  @property({
    type: 'string',
    name: 'clause_type',
  })
  clauseType?: string;

  @property({
    type: 'number',
    name: 'page_no',
  })
  pageNo?: number;

  @property({
    type: 'string',
    name: 'text',
  })
  text?: string;

  @property({
    type: 'string',
    name: 'supported_text',
  })
  supportedText?: string;

  @property({
    type: 'string',
    name: 'coordinates',
  })
  coordinates?: string;

  @property({
    type: 'number',
    name: 'confidence_level',
  })
  confidenceLevel?: number;


  constructor(data?: Partial<OcrResults>) {
    super(data);
  }
}

export interface OcrResultsRelations {
  // describe navigational properties here
}

export type OcrResultsWithRelations = OcrResults & OcrResultsRelations;
