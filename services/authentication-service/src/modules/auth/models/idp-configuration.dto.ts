/* eslint-disable @typescript-eslint/naming-convention */
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model({
  description: 'This is signature for idp configuration.',
})
export class IdpConfiguration extends CoreModel<IdpConfiguration> {
  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  authorization_endpoint: string;

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  end_session_endpoint: string;

  @property({
    type: 'array',
    itemType: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  id_token_signing_alg_values_supported: string[];

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  issuer: string;

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  jwks_uri: string;

  @property({
    type: 'array',
    itemType: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  response_types_supported: string[];

  @property({
    type: 'array',
    itemType: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  scopes_supported: string[];

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  token_endpoint: string;

  @property({
    type: 'array',
    itemType: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  token_endpoint_auth_methods_supported: string[];

  @property({
    type: 'string',
    description: ModelPropertyDescriptionString.reqStrPropDesc,
    required: true,
  })
  userinfo_endpoint: string;
}
