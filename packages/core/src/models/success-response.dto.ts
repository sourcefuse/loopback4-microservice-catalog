// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class SuccessResponse extends Model {
  @property({
    type: 'boolean',
  })
  success?: boolean;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any; //NOSONAR

  constructor(data?: Partial<SuccessResponse>) {
    super(data);
  }
}
