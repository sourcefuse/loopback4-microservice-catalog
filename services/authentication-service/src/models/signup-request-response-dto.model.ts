// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class SignupRequestResponseDto extends CoreModel<SignupRequestResponseDto> {
  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'number',
    required: true,
  })
  expiry: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;
}
