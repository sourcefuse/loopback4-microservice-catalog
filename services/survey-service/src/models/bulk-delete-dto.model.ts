import {model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model({settings: {strict: false}})
export class BulkDeleteDto extends CoreModel<BulkDeleteDto> {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  ids: string[];
}
