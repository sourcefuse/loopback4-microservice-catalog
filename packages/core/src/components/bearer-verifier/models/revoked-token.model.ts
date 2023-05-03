// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';

@model()
export class RevokedToken extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  token: string;

  constructor(data?: Partial<RevokedToken>) {
    super(data);
  }
}
