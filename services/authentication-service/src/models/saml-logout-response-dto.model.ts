// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model({
  description:
    'Result of a SAML logout: the application session is always ended; logoutUrl is the signed IdP Single Logout URL, or null when not applicable.',
})
export class SamlLogoutResponseDto extends CoreModel<SamlLogoutResponseDto> {
  @property({
    type: 'boolean',
    required: true,
  })
  success: boolean;

  @property({
    type: 'string',
    description: 'Id of the user that was logged out.',
  })
  key?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    description:
      'Signed SAML LogoutRequest URL (HTTP-Redirect binding); send the browser here so the IdP ends its session.',
  })
  logoutUrl: string | null;
}
