import {Entity, model, property} from '@loopback/repository';
@model()
export class MockModel extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id: string;
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  itemName: string;
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  description: string;
}
