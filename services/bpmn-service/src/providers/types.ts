import {BindingKey} from '@loopback/core';
import {Workflow, WorkflowDto} from '../models';
import {AnyObject} from '@loopback/repository';

export namespace BPMNBindings {
  export const BPMNProvider = BindingKey.create<BPMN>(
    'sf.bpmn',
  );
}


export interface BPMN {
  create(workflow: WorkflowDto): Promise<SuccessResponse>;

  delete(workflow: Workflow): Promise<AnyObject>;

  update(workflow: WorkflowDto): Promise<SuccessResponse>;

  execute(workflow: ExecutionRequest): Promise<AnyObject>;
}


export type SuccessResponse = {
  version: number,
  provider: string,
  processId: string,
  externalId: string
};

export type ExecutionRequest = {
  version?: number,
  processId: string,
  input: object
};
