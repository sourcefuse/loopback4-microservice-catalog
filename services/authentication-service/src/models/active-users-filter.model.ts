import {Model, model, property} from '@loopback/repository';
import {UserIdentity} from '../enums';

@model()
export class ActiveUsersFilter extends Model {
  @property({
    type: 'boolean',
    required: true,
  })
  inclusion: boolean;

  @property({
    type: 'string',
    required: true,
  })
  userIdentity: UserIdentity;

  @property({
    type: 'object',
    required: true,
  })
  userIdentifier: string[];
}
