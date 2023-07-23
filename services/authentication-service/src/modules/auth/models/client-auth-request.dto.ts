// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable @typescript-eslint/naming-convention */

import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model({
  description: 'This is signature for client authentication request.',
})
export class ClientAuthRequest extends CoreModel<ClientAuthRequest> {
  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  client_id: string; //NOSONAR

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  client_secret: string; //NOSONAR
}
