import {Model, model, property} from '@loopback/repository';

@model()
export class AuthRefreshTokenRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  refreshToken: string;

  constructor(data?: Partial<AuthRefreshTokenRequest>) {
    super(data);
  }
}
