import {AnyObject, Model, model, property} from '@loopback/repository';

@model()
export class QuestionDuplicateDto extends Model {
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

  constructor(data?: Partial<QuestionDuplicateDto>) {
    super(data);
  }
}
