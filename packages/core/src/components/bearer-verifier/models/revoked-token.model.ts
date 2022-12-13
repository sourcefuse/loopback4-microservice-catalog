// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';

/**
 * @model It's a model class that represents a class `RevokedToken` which extends `Entity` class.
 * @decorator `@property` is used to define the properties of the model,
 * returning 'type','id','required' fields.
 * @constructor A constructor is used to create an instance of the class.
 */
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
