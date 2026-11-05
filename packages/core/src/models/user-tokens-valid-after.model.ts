// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreEntity} from '../models';

@model()
export class UserTokensValidAfter extends CoreEntity<UserTokensValidAfter> {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  key: string;

  @property({
    type: 'number',
    required: true,
    description: 'Epoch milliseconds; tokens issued before it are revoked.',
  })
  validAfter: number;
}
