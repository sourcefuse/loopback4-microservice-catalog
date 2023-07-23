// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {DataObject, Entity, Model} from '@loopback/repository';

export abstract class CoreEntity<
  EntityType = DataObject<Model>,
> extends Entity {
  constructor(data?: Partial<EntityType>) {
    super(data);
  }
}
