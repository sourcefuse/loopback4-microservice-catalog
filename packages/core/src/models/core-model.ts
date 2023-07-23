// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {DataObject, Model} from '@loopback/repository';

export abstract class CoreModel<ModelType = DataObject<Model>> extends Model {
  constructor(data?: Partial<ModelType>) {
    super(data);
  }
}
