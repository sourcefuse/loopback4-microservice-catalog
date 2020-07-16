import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class SuccessResponse extends Model {
  @property({
    type: 'boolean',
  })
  success?: boolean;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SuccessResponse>) {
    super(data);
  }
}
