// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';

@model()
export class Otp extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  otp: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  constructor(data?: Partial<Otp>) {
    super(data);
  }
}
