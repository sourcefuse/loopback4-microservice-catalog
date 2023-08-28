// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from './core-model';

@model()
export class ValueResponse extends CoreModel<ValueResponse> {
  @property({
    type: 'number',
    jsonSchema: {
      nullable: true,
    },
  })
  currValue?: number;

  @property({
    type: 'number',
    jsonSchema: {
      nullable: true,
    },
  })
  oldValue?: number;
}
