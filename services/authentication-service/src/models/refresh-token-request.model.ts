// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DataObject, Model, model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class RefreshTokenRequest<T = DataObject<Model>> extends CoreModel<
  T & RefreshTokenRequest
> {
  @property({
    type: 'string',
    required: true,
  })
  refreshToken: string;
}
