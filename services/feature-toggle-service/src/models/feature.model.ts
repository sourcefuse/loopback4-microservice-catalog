﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'features',
  description: 'The features table',
})
export class Feature extends UserModifiableEntity<Feature> {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'string',
    name: 'description',
  })
  description?: string;

  @property({
    type: 'boolean',
    default: true,
    name: 'default_value',
  })
  defaultValue: boolean;
}

export type FeaturesWithRelations = Feature;
