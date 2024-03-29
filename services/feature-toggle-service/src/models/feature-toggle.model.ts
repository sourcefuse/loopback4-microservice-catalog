﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'feature_toggles',
  description: 'The feature-toggle table',
})
export class FeatureToggle extends UserModifiableEntity<FeatureToggle> {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'feature_key',
  })
  featureKey: string;

  @property({
    type: 'string',
    name: 'strategy_key',
  })
  strategyKey: string;

  @property({
    type: 'string',
    name: 'strategy_entity_id',
  })
  strategyEntityId: string;

  @property({
    type: 'boolean',
  })
  status: boolean;
}

export type FeatureToggleWithRelations = FeatureToggle;
