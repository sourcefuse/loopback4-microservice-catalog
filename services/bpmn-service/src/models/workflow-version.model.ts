// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, belongsTo, model, property} from '@loopback/repository';
import {CoreEntity} from '@sourceloop/core';
import {Workflow} from './workflow.model';

@model({
  name: 'workflow_versions',
})
export class WorkflowVersion extends CoreEntity<WorkflowVersion> {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuid',
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
    description: 'Version number assigned to this workflow definition',
  })
  version: number;

  @property({
    type: 'string',
    name: 'bpmn_diagram',
    description: 'Raw XML of the BPMN Diagram',
  })
  bpmnDiagram?: string;

  @property({
    type: 'string',
    name: 'external_workflow_id',
    required: true,
    description:
      'The key that is used to identify the workflow in the respective workflow engine.',
  })
  externalWorkflowId: string;

  @property({
    type: 'object',
    required: true,
    description: 'Schema used for validation during workflow execution',
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
}

export interface WorkflowVersionRelations {
  workflow: Workflow;
  // describe navigational properties here
}

export type WorkflowVersionWithRelations = WorkflowVersion &
  WorkflowVersionRelations;
