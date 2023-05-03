// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class UpsertResponse extends Model {
  @property({
    type: 'object',
  })
  created?: object;

  @property({
    type: 'object',
  })
  updated?: object;

  @property({
    type: 'object',
  })
  failed?: object;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any; //NOSONAR

  constructor(data?: Partial<UpsertResponse>) {
    super(data);
  }
}
