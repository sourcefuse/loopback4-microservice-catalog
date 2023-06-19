import {Model, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<QuestionDuplicateDto>) {
    super(data);
  }
}
