import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class UpsertResponse extends Model {
  @property({
    type: 'object',
  })
  created?: object;

  @property({
    type: 'object',
  })
  updated?: object;

  @property({
    type: 'object',
  })
  failed?: object;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UpsertResponse>) {
    super(data);
  }
}
