import {Model, model, property} from '@loopback/repository';

@model()
export class SignupRequestDto<T = Object> extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'object',
    required: false,
  })
  data?: T;

  constructor(data?: Partial<SignupRequestDto>) {
    super(data);
  }
}
