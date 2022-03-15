import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'features',
  description: 'The features table',
})
export class Feature extends Entity {
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

  constructor(data?: Partial<Feature>) {
    super(data);
  }
}

export type FeaturesWithRelations = Feature;
