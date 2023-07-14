import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class BulkDeleteDto extends Model {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  ids: string[];

  constructor(data?: Partial<BulkDeleteDto>) {
    super(data);
  }
}
