// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class SearchResultBase extends CoreModel<SearchResultBase> {
  @property({
    type: 'string',
    required: true,
  })
  source: string;

  @property({
    type: 'number',
    required: true,
  })
  rank: number;
}

export type SearchResultBaseWithRelations = SearchResultBase;
