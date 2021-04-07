import {AnyObject, hasMany, model, property} from '@loopback/repository';
import {WorkflowVersion} from './workflow-version.model';
import {UserModifiableEntity} from '@sourceloop/core';

@model({
  name: 'workflows',
})
export class Workflow extends UserModifiableEntity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuid',
  })
  id?: string;

  @property({
    type: 'number',
    name: 'workflow_version',
    required: true,
  })
  workflowVersion: number;

  @property({
    type: 'string',
    name: 'external_identifier',
    required: true,
  })
  externalIdentifier: string;

  @property({
    type: 'string',
    name: 'name',
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  provider: string;

  @property({
    type: 'object',
    required: true,
  })
  inputSchema: AnyObject;

  @property({
    type: 'string',
  })
  description?: string;

  @hasMany(() => WorkflowVersion, {
    keyTo: 'workflowId',
    name: 'workflowVersions',
  })
  workflowVersions: WorkflowVersion[];

  constructor(data?: Partial<Workflow>) {
    super(data);
  }
}

export interface WorkflowRelations {
  workflowVersions: WorkflowVersion[];
}

export type WorkflowWithRelations = Workflow & WorkflowRelations;
