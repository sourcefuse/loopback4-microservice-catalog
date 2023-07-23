// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model()
export class Otp extends CoreEntity<Otp> {
  @property({
    type: 'string',
    required: true,
  })
  otp: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;
}
