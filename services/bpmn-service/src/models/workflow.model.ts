import {Entity, model, property} from '@loopback/repository';

@model({
  name: 'workflows',
})
export class Workflow extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    name: 'workflow_id',
    required: true,
  })
  workflowId: string;

  @property({
    type: 'string',
    name: 'workflow_key',
    required: true,
  })
  workflowKey: string;

  @property({
    type: 'string',
    name: 'workflow_version',
    required: true,
  })
  workflowVersion: string;

  @property({
    type: 'object',
    name: 'meta_data',
    default: {}
  })
  metaData?: object;

  constructor(data?: Partial<Workflow>) {
    super(data);
  }
}

// sonarignore:start
export interface WorkflowRelations {
  // no relations yet
}
// sonarignore:end

export type WorkflowWithRelations = Workflow & WorkflowRelations;
