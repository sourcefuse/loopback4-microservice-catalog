import {Model, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class UserDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  roleId: string;

  @property({
    type: 'string',
    required: true,
  })
  tenantId: string;

  @property({
    type: 'number',
  })
  status?: number;

  @property({
    name: 'auth_provider',
    type: 'string',
  })
  authProvider?: string;

  @property({
    name: 'auth_id',
    type: 'string',
  })
  authId?: string;

  @property(() => User)
  userDetails: User;

  constructor(data?: Partial<UserDto>) {
    super(data);
  }
}
