// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Model, model, property} from '@loopback/repository';

@model()
export class SearchResultBase extends Model {
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

  constructor(data?: Partial<SearchResultBase>) {
    super(data);
  }
}

export type SearchResultBaseWithRelations = SearchResultBase;
