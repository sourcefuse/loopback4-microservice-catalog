import {Entity, model, property} from '@loopback/repository';
import {Parameters} from './parameters.model';

@model()
export class Strategies extends Entity {
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
    type: 'string',
    name: 'description',
  })
  description?: string;

  @property({
    type: 'number',
    name: 'built_in',
  })
  builtIn?: number;

  @property({
    type: 'boolean',
    name: 'deprecated',
  })
  deprecated?: boolean;

  @property({
    type: 'number',
    name: 'sort_order',
  })
  sortOrder?: number;

  @property({
    type: 'string',
    name: 'display_name',
  })
  displayName?: string;

  @property({
    type: 'array',
    itemType: 'object',
    name: 'parameters',
  })
  parameters?: Parameters[];

  constructor(data?: Partial<Strategies>) {
    super(data);
  }
}

export interface StrategiesRelations {
  // describe navigational properties here
}

export type StrategiesWithRelations = Strategies & StrategiesRelations;
