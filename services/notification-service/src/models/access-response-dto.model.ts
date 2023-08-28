// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class AccessResponseDto extends CoreModel<AccessResponseDto> {
  @property({
    type: 'number',
  })
  ttl?: number;

  @property({
    type: 'string',
  })
  cipherKey?: string;
}
