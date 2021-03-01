import {Model, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class SignupRequestResponseDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'number',
    required: true,
  })
  expiry: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  constructor(data?: Partial<SignupRequestResponseDto>) {
    super(data);
  }
}
