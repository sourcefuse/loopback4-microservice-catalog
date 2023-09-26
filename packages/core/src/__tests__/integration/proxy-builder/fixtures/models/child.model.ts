import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Parent} from './parent.model';
import {Sibling} from './sibling.model';

@model({
  name: 'children',
  settings: {
    rest: {
      basePath: '/rest-children',
    },
  },
})
export class Child extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => Parent, {keyTo: 'id', name: 'parent'})
  parentId: string;

  @hasMany(() => Sibling, {keyTo: 'firstChildId', name: 'siblingRelations'})
  siblingRelations: Sibling[];

  @hasMany(() => Child, {
    through: {
      model: () => Sibling,
      keyFrom: 'firstChildId',
      keyTo: 'secondChildId',
    },
  })
  siblings: Child[];

  constructor(data?: Partial<Child>) {
    super(data);
  }
}

export interface ChildRelations {
  parent: Parent;
}
