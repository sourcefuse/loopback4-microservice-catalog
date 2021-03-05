import {Model, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
  },
})
export class LocalUserProfileDto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  constructor(data?: Partial<LocalUserProfileDto>) {
    super(data);
  }
}
