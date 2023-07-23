// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model()
export class RevokedToken extends CoreEntity<RevokedToken> {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  token: string;
}
