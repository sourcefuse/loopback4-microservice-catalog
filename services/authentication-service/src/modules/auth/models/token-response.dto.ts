// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model({description: 'This is signature for successful token response.'})
export class TokenResponse extends CoreModel<TokenResponse> {
  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  accessToken: string;

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  refreshToken: string;

  @property({
    type: 'number',
    required: true,
  })
  expires: number;

  @property({
    type: 'string',
  })
  pubnubToken?: string;
}
