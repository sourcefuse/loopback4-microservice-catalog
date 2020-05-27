import {Model, model, property} from '@loopback/repository';

@model()
export class SuccessResponse extends Model {
  @property({
    type: 'boolean',
  })
  success?: boolean;

  constructor(data?: Partial<SuccessResponse>) {
    super(data);
  }
}
