// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model()
export class UserSignupCheckDto extends Model {
  @property({
    type: 'boolean',
    required: true,
  })
  isSignedUp: boolean;

  constructor(data?: Partial<UserSignupCheckDto>) {
    super(data);
  }
}
