// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from '@sourceloop/core';
import {Contracts} from './contract.model';
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

  @belongsTo(
    () => Contracts,
    {name: 'contracts'},
    {
      name: 'contract_id',
      required: true,
    },
  )
  contractId?: string;

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
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  coordinates?: string | any; //NOSONAR

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
  contracts: Contracts;
}

export type OcrResultsWithRelations = OcrResults & OcrResultsRelations;
