import {
  model,
  property,
  belongsTo,
  hasOne,
  hasMany,
} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import {Gender, UserModifiableEntity} from '@sourceloop/core';
import {
  Tenant,
  TenantWithRelations,
  UserCredentials,
  UserCredentialsWithRelations,
  UserTenant,
  UserTenantWithRelations,
} from '../models';

@model({
  name: 'users',
  description: 'This is signature for user model.',
  settings: {
    defaultIdSort: false,
    strict: false,
  },
})
export class User extends UserModifiableEntity implements IAuthUser {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  designation?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
    name: 'auth_client_ids',
  })
  authClientIds: string;

  @property({
    name: 'last_login',
    type: 'string',
  })
  lastLogin?: string;

  @property({
    name: 'photo_url',
    type: 'string',
  })
  photoUrl?: string;

  @property({
    type: 'string',
    description: `This field takes a single character as input in database.
    'M' for male and 'F' for female.`,
    jsonSchema: {
      enum: ['M', 'F', 'O'],
    },
  })
  gender?: Gender;

  @property({
    type: 'date',
  })
  dob?: Date;

  //Indexer property to allow additional data
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  @belongsTo(
    () => Tenant,
    {name: 'defaultTenant'},
    {
      name: 'default_tenant_id',
    },
  )
  defaultTenantId?: string;

  @hasOne(() => UserCredentials, {keyTo: 'userId', name: 'userCredentials'})
  userCredentials: UserCredentials;

  @hasMany(() => UserTenant, {keyTo: 'userId'})
  userTenants: UserTenant[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  defaultTenant: TenantWithRelations;
  userCredentials: UserCredentialsWithRelations;
  userTenants: UserTenantWithRelations[];
}

export type UserWithRelations = User & UserRelations;
