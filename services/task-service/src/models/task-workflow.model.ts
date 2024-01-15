import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'task_workflows',
})
export class TaskWorkflow extends UserModifiableEntity<TaskWorkflow> {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    name: 'workflow_key',
    description: 'An identifier for a particular workflow',
  })
  workflowKey: string;

  @property({
    type: 'string',
    required: true,
    name: 'task_key',
    description: 'An identifier for a particular task within an event',
  })
  taskKey: string;
}
