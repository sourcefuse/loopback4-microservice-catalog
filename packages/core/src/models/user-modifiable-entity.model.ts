// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DataObject, Model, property} from '@loopback/repository';

import {BaseEntity} from './base-entity.model';

export abstract class UserModifiableEntity<
  T = DataObject<Model>,
> extends BaseEntity<T> {
  @property({
    type: 'string',
    name: 'created_by',
  })
  createdBy?: string;

  @property({
    type: 'string',
    name: 'modified_by',
  })
  modifiedBy?: string;
}
