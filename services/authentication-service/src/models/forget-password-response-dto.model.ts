﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class ForgetPasswordResponseDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'number',
    required: true,
  })
  expiry: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: User,
  })
  user: User;

  constructor(data?: Partial<ForgetPasswordResponseDto>) {
    super(data);
  }
}
