// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class UserSignupCheckDto extends CoreModel<UserSignupCheckDto> {
  @property({
    type: 'boolean',
    required: true,
  })
  isSignedUp: boolean;
}
