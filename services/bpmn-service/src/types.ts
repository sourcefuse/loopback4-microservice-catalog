import {AnyObject} from '@loopback/repository';
import {IServiceConfig} from '@sourceloop/core';
import {Workflow, WorkflowVersion} from './models';
import {WorkflowDto} from './models/workflow-dto.model';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICommand {
  parameters?: any; //NOSONAR
  execute(): Promise<any>; //NOSONAR
}

export interface IBPMTask<T, R> {
  operation(data?: T, done?: (data: R) => void): void;
  command: ICommand;
}

export interface IWorkflowServiceConfig extends IServiceConfig {
  useCustomSequence: boolean;
}

export interface WorflowManager<T = AnyObject, S = AnyObject> {
  getWorkflowById(workflow: Workflow): Promise<Workflow>;
  startWorkflow(
    input: T,
    workflow: Workflow,
    version?: WorkflowVersion,
  ): Promise<S>;
  createWorkflow(workflowDto: WorkflowDto): Promise<SuccessResponse>;
  updateWorkflow(workflowDto: WorkflowDto): Promise<SuccessResponse>;
  deleteWorkflowById(workflow: Workflow): Promise<Workflow>;
}

export interface ExecutionInputValidator<T = AnyObject> {
  (schema: AnyObject, input: T): Promise<boolean>;
}

export type SuccessResponse = {
  version: number;
  provider: string;
  processId: string;
  externalId: string;
  fileRef?: string;
};

export const WorkflowCacheSourceName = 'WorkflowCache';
