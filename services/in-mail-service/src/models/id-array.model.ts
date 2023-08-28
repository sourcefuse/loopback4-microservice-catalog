// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// array containing array of Ids.
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class IdArrays extends CoreModel<IdArrays> {
  @property({
    type: 'array',
    itemType: 'string',
    required: false,
  })
  messageIds?: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: false,
  })
  threadIds?: string[];
}
