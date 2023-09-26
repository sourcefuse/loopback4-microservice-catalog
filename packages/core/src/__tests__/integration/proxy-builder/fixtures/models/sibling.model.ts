import {Entity, model, property} from '@loopback/repository';

@model()
export class Sibling extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  firstChildId: string;

  @property({
    type: 'string',
    required: true,
  })
  secondChildId: string;

  constructor(data?: Partial<Sibling>) {
    super(data);
  }
}

export interface SiblingRelations {}
