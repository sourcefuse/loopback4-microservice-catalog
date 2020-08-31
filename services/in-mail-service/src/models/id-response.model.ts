import {property, model, Model} from '@loopback/repository';

@model({
  name: 'IdResponse',
})
export class IdResponse extends Model {
  @property({
    type: 'string',
  })
  id: string;

  constructor(data?: Partial<IdResponse>) {
    super(data);
  }
}
