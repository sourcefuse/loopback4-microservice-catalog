import {
  DataObject,
  Model,
  model,
  property,
  belongsTo,
} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {UserTenant} from './user-tenant.model';

@model({
  name: 'user_invitations',
})
export class UserInvitation<T = DataObject<Model>> extends UserModifiableEntity<
  T & UserInvitation
> {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'date',
    name: 'expires_on',
  })
  expiresOn?: Date;

  @property({
    name: 'token',
    type: 'string',
  })
  token?: string;

  @belongsTo(
    () => UserTenant,
    {keyFrom: 'user_tenant_id', name: 'userTenant'},
    {
      name: 'user_tenant_id',
      required: true,
    },
  )
  userTenantId: string;
}
