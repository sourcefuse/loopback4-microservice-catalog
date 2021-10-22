import {Model, model, property} from '@loopback/repository';

@model()
export class Parameters extends Model {
  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  required?: boolean;

  constructor(data?: Partial<Parameters>) {
    super(data);
  }
}

export type ParametersWithRelations = Parameters;
