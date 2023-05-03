// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model()
export class SignupWithTokenReponseDto<T> extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'object',
    required: true,
  })
  user: T;

  constructor(data?: Partial<SignupWithTokenReponseDto<T>>) {
    super(data);
  }
}
