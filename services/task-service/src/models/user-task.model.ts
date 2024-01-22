import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {UserTaskStatus} from '../types';
import {Task} from './task.model';

@model({
  name: 'user_tasks',
})
export class UserTask extends UserModifiableEntity<Task> {
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
  name: string;

  @property({
    name: 'task_id',
    required: true,
    type: 'string',
  })
  taskId: string;

  @property({
    required: true,
    type: 'string',
  })
  status: UserTaskStatus;

  @property({
    type: 'string',
    required: true,
    name: 'external_id',
  })
  externalId: string;
}
