import {
  Request
} from '@loopback/rest';
import {IServiceConfig} from '@sourceloop/core';
import {Workflow} from './models';

export interface IWorkflowServiceConfig extends IServiceConfig {
  useCustomSequence: boolean;
}

export interface WorflowManager {
  getWorkflowById(workflow: Workflow): Promise<Workflow>;
  startWorkflow(workflow: Workflow): Promise<boolean>;
  createWorkflow(request: Request): Promise<Workflow>;
  updateWorkflow(request: Request): Promise<Workflow>;
}
export const WorkflowCacheSourceName = 'WorkflowCache';
