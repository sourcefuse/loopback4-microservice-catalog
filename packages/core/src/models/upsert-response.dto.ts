import {Model, model, property} from '@loopback/repository';

@model()
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

  constructor(data?: Partial<UpsertResponse>) {
    super(data);
  }
}
