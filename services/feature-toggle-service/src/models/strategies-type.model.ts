import {Model, model, property} from '@loopback/repository';

@model()
export class StrategiesType extends Model {
  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  constraints?: string[];

  @property({
    type: 'object',
  })
  parameters?: object;

  constructor(data?: Partial<StrategiesType>) {
    super(data);
  }
}

export type StrategiesTypeWithRelations = StrategiesType;
