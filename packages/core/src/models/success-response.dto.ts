// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from './core-model';

@model({settings: {strict: false}})
export class SuccessResponse extends CoreModel<SuccessResponse> {
  @property({
    type: 'boolean',
  })
  success?: boolean;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any; //NOSONAR
}
