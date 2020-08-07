import {Model, model, property} from '@loopback/repository';
import {ModelPropertyDescriptionString} from './model-property-description.enum';

@model({description: 'This is signature for successful token response.'})
export class TokenResponse extends Model {
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

  constructor(data?: Partial<TokenResponse>) {
    super(data);
  }
}
