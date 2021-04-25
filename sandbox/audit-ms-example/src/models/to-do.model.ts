import {Entity, model, property} from '@loopback/repository';

@model()
export class ToDo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  items?: string[];

  constructor(data?: Partial<ToDo>) {
    super(data);
  }
}

export interface ToDoRelations {
  // describe navigational properties here
}

export type ToDoWithRelations = ToDo & ToDoRelations;
