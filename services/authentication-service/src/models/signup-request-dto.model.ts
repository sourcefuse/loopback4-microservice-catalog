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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;

  constructor(data?: Partial<SignupRequestDto>) {
    super(data);
  }
}
