import {Entity, model, property} from '@loopback/repository';

@model()
export class TestModel extends Entity {
  @property({
    id: true,
    type: 'string',
    generated: true,
  })
  id: string;

  @property({
    required: true,
    type: 'string',
  })
  name: string;

  @property({
    required: true,
    type: 'string',
  })
  tenantId: string;
  constructor(data?: Partial<TestModel>) {
    super(data);
  }
}
