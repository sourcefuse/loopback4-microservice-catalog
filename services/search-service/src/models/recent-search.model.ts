﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {hasMany, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {SearchQuery} from './search-query.model';

@model({
  name: 'recent_search',
})
export class RecentSearch extends UserModifiableEntity<RecentSearch> {
  @property({
    id: true,
    type: 'String',
    required: false,
    // settings below are needed
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id?: string;

  @property({
    name: 'user_id',
    type: 'string',
  })
  userId?: string;

  @hasMany(() => SearchQuery, {keyTo: 'recentSearchId'})
  params: SearchQuery[];
}

export type RecentSearchWithRelations = RecentSearch;
