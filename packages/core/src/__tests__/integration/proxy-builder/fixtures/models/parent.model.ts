import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Child} from './child.model';
import {ParentConfig} from './parent-config.model';

@model()
export class Parent extends Entity {
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

  @hasMany(() => Child, {keyTo: 'parentId', name: 'children'})
  children: Child[];

  @hasOne(() => ParentConfig, {keyTo: 'parentId', name: 'config'})
  config: ParentConfig;

  constructor(data?: Partial<Parent>) {
    super(data);
  }
}

export interface ParentRelations {}
