// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {hasMany, model, property} from '@loopback/repository';
import {BaseEntity} from '@sourceloop/core';
import {OcrResults} from './ocr-results.model';
@model({
  name: 'ocr_contracts',
  settings: {
    strict: false,
  },
})
export class Contracts extends BaseEntity {
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
  contractName: string;

  @property({
    type: 'boolean',
    default: false,
    name: 'contract_uploaded',
  })
  contractUploaded?: boolean;

  @property({
    type: 'boolean',
    default: false,
    name: 'image_converted',
  })
  imageConverted?: boolean;

  @property({
    type: 'boolean',
    default: false,
    name: 'ocr_converted',
  })
  ocrConverted?: boolean;

  @property({
    type: 'boolean',
    default: false,
    name: 'hocr_converted',
  })
  hocrConverted?: boolean;

  @hasMany(() => OcrResults, {keyTo: 'contractId'})
  ocrResults: OcrResults[];

  constructor(data?: Partial<Contracts>) {
    super(data);
  }
}

export interface ContractsRelations {
  ocrResults: OcrResults[];
}

export type ContractsWithRelations = Contracts & ContractsRelations;
