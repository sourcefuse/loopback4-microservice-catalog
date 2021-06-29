import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {IUserResource} from 'loopback4-authorization';

@model({
  name: 'user_resources',
})
export class UserLevelResource
  extends UserModifiableEntity
  implements IUserResource<string>
{
  @property({
    type: 'string',
    id: true,
    name: 'id',
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'user_tenant_id',
  })
  userTenantId: string;

  @property({
    type: 'string',
    required: true,
    name: 'resource_name',
  })
  resourceName: string;

  @property({
    type: 'string',
    required: true,
    name: 'resource_value',
  })
  resourceValue: string;

  @property({
    type: 'boolean',
    required: true,
    default: true,
    name: 'allowed',
  })
  allowed: boolean;

  constructor(data?: Partial<UserLevelResource>) {
    super(data);
  }
}
