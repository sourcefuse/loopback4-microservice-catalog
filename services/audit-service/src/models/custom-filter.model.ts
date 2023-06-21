import {Model, model, property} from '@loopback/repository';

@model()
export class CustomFilter extends Model {
  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        fromDate: {
          type: 'string',
          default: new Date().toISOString(),
        },
        toDate: {
          type: 'string',
          default: new Date().toISOString(),
        },
      },
    },
  })
  date?: {
    fromDate: Date;
    toDate: Date;
  };

  @property({
    type: 'boolean',
  })
  deleted?: boolean;

  @property({
    type: 'string',
  })
  entityId?: string;

  @property({
    type: 'string',
  })
  actedOn?: string;

  constructor(data?: Partial<CustomFilter>) {
    super(data);
  }
}

export type CustomFilterWithRelations = CustomFilter;
