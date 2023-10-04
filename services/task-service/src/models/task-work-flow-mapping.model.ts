import {model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';

@model({
  name: 'task_workflows',
})
export class TaskWorkflows extends CoreEntity<TaskWorkflows> {
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
