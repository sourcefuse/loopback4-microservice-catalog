import {Model, model, property} from '@loopback/repository';
import {getJsonSchema} from '@loopback/rest';
import {AddressDTO} from '.';
import {AuthClient} from '../auth-client.model';

@model()
export class UserWebhookDTO extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  tenantName: string;

  @property({
    type: 'string',
    required: true,
  })
  tenantKey: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  lastName: string;

  @property({
    type: 'string',
  })
  middleName: string;

  @property({
    type: 'string',
  })
  cognitoAuthId: string;

  @property({
    type: 'object',
    description: 'auth client object to be created for the tenant client',
    jsonSchema: getJsonSchema(AuthClient, {
      exclude: ['id'],
    }),
  })
  authClient?: Omit<AuthClient, 'id'>;

  @property({
    type: 'object',
    description: 'address object to be created for the lead',
    jsonSchema: getJsonSchema(AddressDTO, {
      exclude: ['id'],
    }),
  })
  address?: Omit<AddressDTO, 'id'>;

  constructor(data?: Partial<UserWebhookDTO>) {
    super(data);
  }
}
