// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, Model, model, property} from '@loopback/repository';

@model()
export class SignupRequestDto<T = AnyObject> extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'object',
    required: false,
  })
  data?: T;

  constructor(data?: Partial<SignupRequestDto<T>>) {
    super(data);
  }
}
