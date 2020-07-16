import {Entity, model, property} from '@loopback/repository';

@model()
export class Otp extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  otp: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  constructor(data?: Partial<Otp>) {
    super(data);
  }
}
