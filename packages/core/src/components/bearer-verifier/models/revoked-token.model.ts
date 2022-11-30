// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Entity, model, property} from '@loopback/repository';

/**  
 * It's a model class that represents a revoked token which extends `Entity` class.
 * A decorator 'property' is used to define the properties of the model,
   returning 'type','id','required' fields.
 * A constructor is used to create an instance of the class. 
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
