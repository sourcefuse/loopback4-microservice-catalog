import {Model, model, property} from '@loopback/repository';

@model()
export class AccessResponseDto extends Model {
  @property({
    type: 'number',
  })
  ttl?: number;

  @property({
    type: 'string',
  })
  cipherKey?: string;

  constructor(data?: Partial<AccessResponseDto>) {
    super(data);
  }
}
