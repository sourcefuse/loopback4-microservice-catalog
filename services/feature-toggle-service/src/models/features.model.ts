import {Entity, model, property} from '@loopback/repository';
import {StrategiesType} from './strategies-type.model';

@model({
  name: 'features',
  description: 'The features table',
})
export class Features extends Entity {
  @property({
    type: 'date',
    name: 'created_at',
  })
  createdAt?: string;

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    name: 'name',
  })
  name: string;

  @property({
    type: 'number',
    default: 0,
    name: 'enabled',
  })
  enabled?: number;

  @property({
    type: 'string',
    name: 'description',
  })
  description?: string;

  @property({
    type: 'number',
    default: 0,
    name: 'archived',
  })
  archived?: number;

  @property({
    type: 'array',
    itemType: 'object',
    name: 'strategies',
  })
  strategies?: StrategiesType[];

  @property({
    type: 'array',
    itemType: 'object',
    name: 'variants',
  })
  variants?: object[];

  @property({
    type: 'string',
    name: 'type',
  })
  type?: string;

  @property({
    type: 'boolean',
    name: 'stale',
  })
  stale?: boolean;

  @property({
    type: 'string',
    name: 'project',
  })
  project?: string;

  @property({
    type: 'date',
    name: 'last_seen_at',
  })
  lastSeenAt?: Date;

  constructor(data?: Partial<Features>) {
    super(data);
  }
}

export type FeaturesWithRelations = Features;
