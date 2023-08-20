import {BindingScope, injectable, service} from '@loopback/core';
import {Workflow, WorkflowRepository} from '@sourceloop/bpmn-service';
import {TaskServiceNames} from '../types';
import {EventWorkflowMapping, TaskWorkFlowMapping} from '../models';
import {Filter, repository} from '@loopback/repository';
import {
  EventWorkflowMappingRepository,
  TaskWorkFlowMappingRepository,
} from '../repositories';
import {CamundaService} from './camunda.service';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class WorkflowOperationService {
  constructor(
    @repository(WorkflowRepository)
    private readonly workflowRepo: WorkflowRepository,
    @repository(EventWorkflowMappingRepository)
    private readonly eventWorkflowMapping: EventWorkflowMappingRepository,
    @repository(TaskWorkFlowMappingRepository)
    private readonly taskWorkflowMapping: TaskWorkFlowMappingRepository,
    @service(CamundaService)
    private readonly camundaService: CamundaService,
  ) {}

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
          await this.camundaService.execute(workflow.externalIdentifier, {});
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
  ): Promise<TaskWorkFlowMapping | null> {
    const filter: Filter<TaskWorkFlowMapping> = {
      where: {
        taskKey: keyValue,
      },
    };

    return this.taskWorkflowMapping.findOne(filter);
  }

  private async _findEventWorkflowByKey(
    keyValue: string,
  ): Promise<EventWorkflowMapping | null> {
    const filter: Filter<EventWorkflowMapping> = {
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
