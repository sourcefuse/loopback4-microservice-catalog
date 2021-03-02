import {Model, model, property} from '@loopback/repository';

@model()
export class SignupRequestDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'object',
    required: false,
  })
  data?: Object;

  constructor(data?: Partial<SignupRequestDto>) {
    super(data);
  }
}
