/* eslint-disable  @typescript-eslint/naming-convention */

import {Model, model, property} from '@loopback/repository';

@model()
export class ResetPasswordWithClient extends Model {
  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  // sonarignore:start
  @property({
    type: 'string',
    required: true,
  })
  client_id: string;

  @property({
    type: 'string',
    required: true,
  })
  client_secret: string;
  // sonarignore:end

  constructor(data?: Partial<ResetPasswordWithClient>) {
    super(data);
  }
}
