// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DataObject, Model, property} from '@loopback/repository';
import {SoftDeleteEntity} from 'loopback4-soft-delete';

export abstract class BaseEntity<
  T = DataObject<Model>,
> extends SoftDeleteEntity {
  @property({
    type: 'date',
    default: () => new Date(),
    name: 'created_on',
  })
  createdOn?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    name: 'modified_on',
  })
  modifiedOn?: Date;

  constructor(data?: Partial<T>) {
    super(data);
  }
}
