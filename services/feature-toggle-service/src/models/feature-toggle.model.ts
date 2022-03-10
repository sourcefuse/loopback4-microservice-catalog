import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'feature_toggles',
  description: 'The feature-toggle table',
})
export class FeatureToggle extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'feature_id',
  })
  featureId: string;

  @property({
    type: 'string',
    name: 'strategy_id',
  })
  strategyId: string;

  @property({
    type: 'string',
    name: 'item_id',
  })
  itemId: string;

  @property({
    type: 'boolean',
  })
  status: boolean;

  constructor(data?: Partial<FeatureToggle>) {
    super(data);
  }
}

export type FeatureToggleWithRelations = FeatureToggle;
