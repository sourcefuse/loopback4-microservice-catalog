// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {property} from '@loopback/repository';

import {BaseEntity} from './base-entity.model';

export abstract class UserModifiableEntity extends BaseEntity {
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
