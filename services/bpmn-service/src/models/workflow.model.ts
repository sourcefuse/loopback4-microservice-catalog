﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, hasMany, model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {WorkflowVersion} from './workflow-version.model';

@model({
  name: 'workflows',
})
export class Workflow extends UserModifiableEntity<Workflow> {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuid',
  })
  id?: string;

  @property({
    type: 'number',
    name: 'workflow_version',
    description: 'Last deployed workflow version',
    required: true,
  })
  workflowVersion: number;

  @property({
    type: 'string',
    name: 'external_identifier',
    required: true,
    description:
      'The key that is used to identify the workflow in the respective workflow engine.',
  })
  externalIdentifier: string;

  @property({
    type: 'string',
    name: 'name',
    description: 'Name of the workflow',
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    description:
      'Provider could be the engine that will handle the workflow - camunda, zeebe, etc',
  })
  provider: string;

  @property({
    type: 'object',
    required: true,
    description: 'Schema used for validation during workflow execution',
  })
  inputSchema: AnyObject;

  @property({
    type: 'string',
    description: 'Description of the workflow',
  })
  description?: string;

  @hasMany(() => WorkflowVersion, {
    keyTo: 'workflowId',
    name: 'workflowVersions',
  })
  workflowVersions: WorkflowVersion[];
}

export interface WorkflowRelations {
  workflowVersions: WorkflowVersion[];
}

export type WorkflowWithRelations = Workflow & WorkflowRelations;
