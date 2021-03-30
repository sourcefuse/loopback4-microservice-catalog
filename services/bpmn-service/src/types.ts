import {
  Request
} from '@loopback/rest';
import {IServiceConfig} from '@sourceloop/core';
import {Workflow} from './models';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICommand {
  parameters?: any;
  execute(): Promise<any>;
}

export interface IBPMTask<T, R> {
  operation(data?: T, done?: (data: R) => void): void;
  command: ICommand;
}

export interface IWorkflowServiceConfig extends IServiceConfig {
  useCustomSequence: boolean;
}

export interface WorflowManager {
  getWorkflowById(workflow: Workflow): Promise<Workflow>;
  startWorkflow(workflow: Workflow, request: Request): Promise<boolean>;
  createWorkflow(request: Request): Promise<Workflow>;
  updateWorkflow(request: Request): Promise<Workflow>;
}

export const WorkflowCacheSourceName = 'WorkflowCache';
