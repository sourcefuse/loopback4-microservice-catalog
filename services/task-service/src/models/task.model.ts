import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model({
  name: 'tasks',
})
export class Task extends CoreEntity<Task> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    description: 'An identifier for a particular task within an event',
  })
  key: string;

  @property({
    type: 'string',
    required: true,
    description: 'A name given by the consumer service for this task',
  })
  name: string;

  @property({
    type: 'string',
    required: false,
    description: 'A short description of this task',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
    description: 'A short message to indicate the progression of the task',
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
