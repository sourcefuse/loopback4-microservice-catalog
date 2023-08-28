import {AnyObject, model, property} from '@loopback/repository';
import {CoreModel} from '@sourceloop/core';

@model()
export class QuestionDuplicateDto extends CoreModel<QuestionDuplicateDto> {
  @property({
    type: 'boolean',
  })
  includeBatchId?: boolean;

  @property({
    type: 'number',
  })
  displayOrder?: number;

  @property({
    type: 'string',
    name: 'ext_id',
  })
  extId?: string;

  @property({
    type: 'object',
    name: 'ext_metadata',
  })
  extMetadata?: AnyObject;
}
