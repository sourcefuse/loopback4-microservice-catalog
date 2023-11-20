import {Workflow} from '@sourceloop/bpmn-service';
import {TaskWorkflows} from '../models';

export interface WorkflowOperationServiceInterface {
  execWorkflow(keyVal: string, taskOrEvent: string): Promise<Workflow | null>;
  findTaskWorkflowByKey(keyValue: string): Promise<TaskWorkflows | null>;
  findWorkflowByKey(keyValue: string): Promise<Workflow | null>;
}
