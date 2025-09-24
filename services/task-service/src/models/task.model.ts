import {AnyObject, hasMany, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {TaskStatus} from '../types';
import {UserTask} from './user-task.model';

@model({
  name: 'tasks',
})
export class Task<TS = TaskStatus> extends UserModifiableEntity<Task> {
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
    default: TaskStatus.Pending,
    description: 'A short message to indicate the progression of the task',
  })
  status: TS;

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
    name: 'assignee_id',
  })
  assigneeId?: string;

  @property({
    type: 'object',
    required: true,
  })
  metadata: AnyObject;

  @hasMany(() => UserTask, {
    keyTo: 'taskId',
  })
  userTasks?: UserTask[];

  @property({
    name: 'external_id',
    type: 'string',
  })
  externalId?: string;

  @property({
    name: 'notes',
    type: 'string',
  })
  notes?: string;
}
