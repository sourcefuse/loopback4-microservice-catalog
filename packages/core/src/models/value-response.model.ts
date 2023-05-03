// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model()
export class ValueResponse extends Model {
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

  constructor(data?: Partial<ValueResponse>) {
    super(data);
    this.currValue = data?.currValue;
    this.oldValue = data?.oldValue;
  }
}
