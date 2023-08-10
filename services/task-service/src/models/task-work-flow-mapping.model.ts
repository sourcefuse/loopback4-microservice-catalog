import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'task_workflow_mappings',
})
export class TaskWorkFlowMapping extends Entity {
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
  })
  workflowKey: string;

  @property({
    type: 'string',
    required: true,
    name: 'task_key',
  })
  taskKey: string;
}
