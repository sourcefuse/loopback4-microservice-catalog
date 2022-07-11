// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model()
export class AccessResponseDto extends Model {
  @property({
    type: 'number',
  })
  ttl?: number;

  @property({
    type: 'string',
  })
  cipherKey?: string;

  constructor(data?: Partial<AccessResponseDto>) {
    super(data);
  }
}
