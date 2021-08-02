import {AnyObject} from '@loopback/repository';
import {IServiceConfig} from '@sourceloop/core';
import {BPMTask} from './bpm-task';
import {Workflow, WorkflowVersion, WorkflowDto} from '../models';

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
  workflowEngineBaseUrl?: string;
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
  deleteWorkflowVersionById?(
    version: WorkflowVersion,
  ): Promise<WorkflowVersion>;
}

export interface ExecutionInputValidator<T = AnyObject> {
  (schema: AnyObject, input: T): Promise<boolean>;
}

export interface WorkerRegisterFn<T = AnyObject, R = AnyObject> {
  (
    bpmnName: string,
    topicName: string,
    commandCtor: BPMTask<T, R>,
  ): Promise<void>;
}

export type WorkerMap<T = AnyObject, R = AnyObject> = {
  [workflowName: string]: WorkerNameCmdPair<T, R>[];
};

export type WorkerNameCmdPair<T = AnyObject, R = AnyObject> = {
  topic: string;
  command: BPMTask<T, R>;
  running: boolean;
};

export interface WorkerImplementationFn<T = AnyObject, R = AnyObject> {
  (worker: WorkerNameCmdPair<T, R>): Promise<void>;
}

export type SuccessResponse = {
  version: number;
  provider: string;
  processId: string;
  externalId: string;
  fileRef?: string;
};

export const WorkflowCacheSourceName = 'WorkflowCache';
