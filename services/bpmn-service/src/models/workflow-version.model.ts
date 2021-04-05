import {
  AnyObject,
  belongsTo,
  Entity,
  model,
  property,
} from '@loopback/repository';
import {Workflow} from './workflow.model';

@model({
  name: 'workflow_versions',
})
export class WorkflowVersion extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  version: number;

  @property({
    type: 'string',
    name: 'bpmn_diagram',
  })
  bpmnDiagram?: string;

  @property({
    type: 'string',
    name: 'external_workflow_id',
    required: true,
  })
  externalWorkflowId: string;

  @property({
    type: 'object',
    required: true,
  })
  inputSchema: AnyObject;

  @belongsTo(
    () => Workflow,
    {
      keyFrom: 'workflowId',
      name: 'workflow',
    },
    {
      name: 'workflow_id',
    },
  )
  workflowId: string;

  constructor(data?: Partial<WorkflowVersion>) {
    super(data);
  }
}

export interface WorkflowVersionRelations {
  workflow: Workflow;
  // describe navigational properties here
}

export type WorkflowVersionWithRelations = WorkflowVersion &
  WorkflowVersionRelations;
