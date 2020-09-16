// array containing array of Ids.
import {property, model, Model} from '@loopback/repository';

@model()
export class IdArrays extends Model {
  @property({
    type: 'array',
    itemType: 'string',
    required: false,
  })
  messageIds?: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: false,
  })
  threadIds?: string[];

  constructor(data?: Partial<IdArrays>) {
    super(data);
  }
}
