import {Entity, model, property} from '@loopback/repository';

@model()
export class Tasks extends Entity {
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
    name: 'start_date',
  })
  startDate?: Date;

  @property({
    type: 'date',
    required: false,
    name: 'due_date',
  })
  dueDate?: Date;

  @property({
    type: 'date',
    required: false,
    name: 'end_date',
  })
  endDate?: Date;

  @property({
    type: 'string',
    required: true,
    name: 'assignee_id',
  })
  assigneeId: string;
}
