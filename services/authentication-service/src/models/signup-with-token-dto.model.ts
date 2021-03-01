import {Model, model, property} from '@loopback/repository';

@model()
export class SignupWithTokenDto<T> extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'object',
    required: true,
  })
  model: T;

  constructor(data?: Partial<SignupWithTokenDto<T>>) {
    super(data);
  }
}
