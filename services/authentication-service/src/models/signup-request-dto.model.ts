/* eslint-disable  @typescript-eslint/naming-convention */

import {Model, model, property} from '@loopback/repository';

@model()
export class SignupRequestDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  constructor(data?: Partial<SignupRequestDto>) {
    super(data);
  }
}
