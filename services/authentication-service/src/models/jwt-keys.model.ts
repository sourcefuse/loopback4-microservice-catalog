import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'jwt_keys',
})
export class JwtKeys extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'key_id',
  })
  keyId: string;

  @property({
    type: 'string',
    required: true,
    name: 'public_key',
  })
  publicKey: string;

  @property({
    type: 'string',
    required: true,
    name: 'private_key',
  })
  privateKey: string;

  @property({
    type: 'date',
    default: () => new Date(),
    name: 'created_on',
  })
  createdOn?: Date;

  constructor(data?: Partial<JwtKeys>) {
    super(data);
  }
}
