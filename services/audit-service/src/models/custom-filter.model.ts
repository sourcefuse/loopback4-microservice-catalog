import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';
const defaultFromDate = '2023-01-01T00:00:00.000Z';
const defaultToDate = '2023-01-01T00:00:00.000Z';

@model()
export class CustomFilter extends CoreModel<CustomFilter> {
  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        fromDate: {
          type: 'string',
          default: defaultFromDate,
        },
        toDate: {
          type: 'string',
          default: defaultToDate,
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

  /** Both actedOn and actionGroup parameters accepts a
   * list of values that you want to archive  */

  @property({
    jsonSchema: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
  })
  actedOn?: string[];

  @property({
    jsonSchema: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
  })
  actionGroup?: string[];
}

export type CustomFilterWithRelations = CustomFilter;
