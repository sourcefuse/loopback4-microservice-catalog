// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject, Filter, FilterExcludingWhere} from '@loopback/repository';
import {IServiceConfig} from '@sourceloop/core';
import {
  ExecuteWorkflowDto,
  Workflow,
  WorkflowDto,
  WorkflowVersion,
} from '../models';
import {BPMTask} from './bpm-task';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICommand {
  parameters?: any; //NOSONAR
  execute(): Promise<any>; //NOSONAR
}

export interface IWorkflowService {
  create(workflow: WorkflowDto): Promise<Workflow>;
  updateById(id: string, workflow: Partial<WorkflowDto>): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteVersionById(id: string, version: number): Promise<void>;
  findById(
    id: string,
    filter?: FilterExcludingWhere<Workflow>,
  ): Promise<Workflow>;
  find(filter?: Filter<Workflow>): Promise<Workflow[]>;
  count(id: string): Promise<Workflow>;
  executeById(id: string, instance: ExecuteWorkflowDto): Promise<AnyObject>;
}

export interface ICommandWithTopic extends ICommand {
  topic: string;
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
  updateWorkflow(workflowDto: Partial<WorkflowDto>): Promise<SuccessResponse>;
  deleteWorkflowById(workflow: Workflow): Promise<Workflow>;
  deleteWorkflowVersionById?(
    version: WorkflowVersion,
  ): Promise<WorkflowVersion>;
}
export type HttpOptions = {
  query?: AnyObject;
  urlParams?: AnyObject;
  headers?: AnyObject;
};

export type ExecutionInputValidator<T = AnyObject> = (
  schema: AnyObject,
  input: T,
) => Promise<boolean>;

export type WorkerRegisterFn<T = AnyObject, R = AnyObject> = (
  bpmnName: string,
  topicName: string,
  commandCtor: BPMTask<T, R>,
) => Promise<void>;

export type WorkerMap<T = AnyObject, R = AnyObject> = {
  [workflowName: string]: WorkerNameCmdPair<T, R>[];
};

export type WorkerNameCmdPair<T = AnyObject, R = AnyObject> = {
  topic: string;
  command: BPMTask<T, R>;
  running: boolean;
};

export type WorkerImplementationFn<T = AnyObject, R = AnyObject> = (
  worker: WorkerNameCmdPair<T, R>,
) => Promise<void>;

export type SuccessResponse = {
  version: number;
  provider: string;
  processId: string;
  externalId: string;
  fileRef?: string;
};

export const WorkflowCacheSourceName = 'WorkflowCache';
