import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'strategies',
  description: 'The strategies table',
})
export class Strategy extends Entity {
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
    type: 'number',
  })
  priority: string;

  constructor(data?: Partial<Strategy>) {
    super(data);
  }
}

export type StrategiesWithRelations = Strategy;
