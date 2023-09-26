import {Entity, model, property} from '@loopback/repository';
import {Parent} from './parent.model';

@model({
  name: 'rest-parent-configs',
})
export class ParentConfig extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  config: string;

  @property({
    type: 'string',
    required: true,
  })
  parentId: string;

  constructor(data?: Partial<ParentConfig>) {
    super(data);
  }
}

export interface ParentConfigRelations {
  parent: Parent;
}
