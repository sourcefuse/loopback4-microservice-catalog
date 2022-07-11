// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {property, model, Model} from '@loopback/repository';

@model()
export class IdResponse extends Model {
  @property({
    type: 'string',
  })
  id: string;

  constructor(data?: Partial<IdResponse>) {
    super(data);
  }
}
