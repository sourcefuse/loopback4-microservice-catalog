import {model, property} from '@loopback/repository';
import {User as BaseUser} from '@sourceloop/user-tenant-service';
@model({name: 'users', settings: {strict: false}})
export class User extends BaseUser {
  @property({
    type: 'string',
    required: true,
  })
  test: string;

  // Define well-known properties here

  //Indexer property to allow additional data
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any; // NOSONAR

  constructor(data?: Partial<User>) {
    super(data);
  }
}
