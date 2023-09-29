import {model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class UserDto extends User {
  @property({
    type: 'string',
    required: true,
  })
  roleId: string;

  @property({
    type: 'string',
  })
  locale?: string;

  constructor(data?: Partial<UserDto>) {
    super(data);
  }
}
