import {Entity, model, property} from '@loopback/repository';

@model()
export class Test extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id: number;
  @property({
    type: 'string',
  })
  name: string;
  constructor(data?: Partial<Test>) {
    super(data);
  }
}
