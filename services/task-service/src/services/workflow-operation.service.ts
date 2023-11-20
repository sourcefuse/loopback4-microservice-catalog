import {BindingScope, inject, injectable} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  Workflow,
  WorkflowProvider,
  WorkflowRepository,
  WorkflowVersion,
} from '@sourceloop/bpmn-service';
import {WorkflowOperationServiceInterface} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {EventWorkflows, TaskWorkflows} from '../models';
import {
  EventWorkflowMappingRepository,
  TaskWorkFlowMappingRepository,
} from '../repositories';
import {TaskServiceNames} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class WorkflowOperationService
  implements WorkflowOperationServiceInterface
{
  private startWorkflow: <T, S>(
    input: T,
    workflow: Workflow,
    version?: WorkflowVersion,
  ) => Promise<S>;
  constructor(
    @repository(WorkflowRepository)
    private readonly workflowRepo: WorkflowRepository,
    @repository(EventWorkflowMappingRepository)
    private readonly eventWorkflowMapping: EventWorkflowMappingRepository,
    @repository(TaskWorkFlowMappingRepository)
    private readonly taskWorkflowMapping: TaskWorkFlowMappingRepository,
    @inject(TaskServiceBindings.TASK_WORKFLOW_MANAGER)
    private readonly taskWorkflowManager: WorkflowProvider,
  ) {
    const {startWorkflow} = this.taskWorkflowManager.value();
    this.startWorkflow = startWorkflow;
  }

  public async execWorkflow(
    keyVal: string,
    taskOrEvent: string,
  ): Promise<Workflow | null> {
    let taskOrWorkflowItem;
    switch (taskOrEvent) {
      case TaskServiceNames.TASK:
        taskOrWorkflowItem = await this.findTaskWorkflowByKey(keyVal);
        break;
      case TaskServiceNames.EVENT:
        taskOrWorkflowItem = await this._findEventWorkflowByKey(keyVal);
        break;
      default:
        break;
    }
    if (taskOrWorkflowItem) {
      const workflow = await this.findWorkflowByKey(
        taskOrWorkflowItem.workflowKey,
      );
      if (workflow) {
        try {
          await this.startWorkflow({}, workflow);
          return workflow;
        } catch (e) {
          throw new HttpErrors.NotFound('Workflow not found');
        }
      }
    }
    return null;
  }

  public async findTaskWorkflowByKey(
    keyValue: string,
  ): Promise<TaskWorkflows | null> {
    const filter: Filter<TaskWorkflows> = {
      where: {
        taskKey: keyValue,
      },
    };

    return this.taskWorkflowMapping.findOne(filter);
  }

  private async _findEventWorkflowByKey(
    keyValue: string,
  ): Promise<EventWorkflows | null> {
    const filter: Filter<EventWorkflows> = {
      where: {
        eventKey: keyValue,
      },
    };

    return this.eventWorkflowMapping.findOne(filter);
  }

  public async findWorkflowByKey(keyValue: string): Promise<Workflow | null> {
    const filter: Filter<Workflow> = {
      where: {
        name: keyValue,
      },
    };
    return this.workflowRepo.findOne(filter);
  }
}
