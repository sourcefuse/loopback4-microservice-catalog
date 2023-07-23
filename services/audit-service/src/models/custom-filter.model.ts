import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class CustomFilter extends CoreModel<CustomFilter> {
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
}

export type CustomFilterWithRelations = CustomFilter;
