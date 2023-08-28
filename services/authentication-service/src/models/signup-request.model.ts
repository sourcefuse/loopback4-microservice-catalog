// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class SignupRequest extends CoreModel<SignupRequest> {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    require: true,
  })
  expiry: string;
}
