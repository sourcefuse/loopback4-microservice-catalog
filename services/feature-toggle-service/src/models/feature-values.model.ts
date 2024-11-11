// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'feature_values',
  description: 'The feature-values table',
})
export class FeatureValues extends UserModifiableEntity<FeatureValues> {
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
  strategyEntityId?: string; // can be null in case of system strategy

  @property({
    type: 'boolean',
  })
  status: boolean;

  @property({
    type: 'string',
    name: 'value',
  })
  value: string;
}
export type FeatureValuesWithRelations = FeatureValues;
