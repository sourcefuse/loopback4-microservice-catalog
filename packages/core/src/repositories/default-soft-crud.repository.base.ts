// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {SoftCrudRepository, SoftDeleteEntity} from 'loopback4-soft-delete';

export class DefaultSoftCrudRepository<
  T extends SoftDeleteEntity,
  ID,
  Relations extends object = {},
> extends SoftCrudRepository<T, ID, Relations> {}
