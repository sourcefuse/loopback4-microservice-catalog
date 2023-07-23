// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class SignupWithTokenReponseDto<T> extends CoreModel<
  SignupWithTokenReponseDto<T>
> {
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
}
