// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class SignupRequestDto<T = AnyObject> extends CoreModel<
  SignupRequestDto<T>
> {
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
}
