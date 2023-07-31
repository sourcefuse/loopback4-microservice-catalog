import {Entity, model, property} from '@loopback/repository';

@model()
export class Task extends Entity {
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
  key: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'string',
    required: true,
  })
  priority: string;

  @property({
    type: 'string',
    required: true,
  })
  severity: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'date',
    required: false,
  })
  startDate?: Date;

  @property({
    type: 'date',
    required: false,
  })
  dueDate?: Date;

  @property({
    type: 'date',
    required: false,
  })
  endDate?: Date;

  @property({
    type: 'string',
    required: true,
  })
  assigneeId: string;
}
