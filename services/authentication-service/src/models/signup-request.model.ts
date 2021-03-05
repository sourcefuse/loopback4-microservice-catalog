import {Model, model, property} from '@loopback/repository';

@model()
export class SignupRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    require: true,
  })
  expiry: string;

  constructor(data?: Partial<SignupRequest>) {
    super(data);
  }
}
