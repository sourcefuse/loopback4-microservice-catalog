import {
  injectable,
  /* inject, */ BindingScope,
  service,
  inject,
  Getter,
} from '@loopback/core';
import {AnyObject, Filter, repository} from '@loopback/repository';
import {TaskRepository} from '../repositories/task.repository';
import {EventWorkflowMapping, TaskWorkFlowMapping, Tasks} from '../models';
import {CamundaService} from './camunda.service';
import {
  WorkflowServiceBindings,
  WorkerRegisterFn,
  BPMTask,
  WorkerMap,
  WorkerImplementationFn,
  WorkflowRepository,
  Workflow,
} from '@sourceloop/bpmn-service';
import {TaskProcessorCommand} from '../commands';
import {
  EventWorkflowMappingRepository,
  TaskWorkFlowMappingRepository,
} from '../repositories';
import {TaskServiceBindings} from '../keys';
import {BpmnRunner} from '../providers';

@injectable({scope: BindingScope.TRANSIENT})
export class TaskOperationService {
  constructor(
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
    @service(CamundaService)
    private readonly camundaService: CamundaService,
    @inject(WorkflowServiceBindings.RegisterWorkerFunction)
    private readonly regFn: WorkerRegisterFn,
    @inject.getter(WorkflowServiceBindings.WORKER_MAP)
    private readonly workerMapGetter: Getter<WorkerMap>,
    @inject(WorkflowServiceBindings.WorkerImplementationFunction)
    private readonly workerFn: WorkerImplementationFn,
    @repository(TaskWorkFlowMappingRepository)
    private readonly taskWorkflowMapping: TaskWorkFlowMappingRepository,
    @repository(EventWorkflowMappingRepository)
    private readonly eventWorkflowMappingRepo: EventWorkflowMappingRepository,
    @repository(WorkflowRepository)
    private readonly workflowRepo: WorkflowRepository,
    @inject(TaskServiceBindings.BPMN_RUNNER)
    private readonly bpmnRunner: () => any,
  ) {
    // empty
    this.providedVal = this.bpmnRunner;
  }

  providedVal: any = {};

  /*
   * Add service methods here
   */

  public async addTaskToDB(task: AnyObject) {
    // add a task to DB
    await this.taskRepo.create({
      key: task.key,
      name: task.name,
      status: task.status,
      severity: task.severity,
      priority: task.priority,
      type: task.type,
      assigneeId: task.assigneeId,
    });
  }

  private createTaskProcessorFunction(updatedPayload: any, task: any) {
    // Deep clone the payload
    // const clonedPayload = JSON.parse(JSON.stringify(updatedPayload));

    // console.log('closure fn - ', clonedPayload);

    return (taskOfWorkerFn: any, taskServiceOfWorkerFn: any) => {
      // logic given by the consumer to be plugged in
      console.log('worker fn plugin- ', updatedPayload);
      return this.providedVal['wf'][task.topicName](
        taskOfWorkerFn,
        taskServiceOfWorkerFn,
        updatedPayload,
      );
    };
  }

  public async processTask(id: string, name: string, payload?: any) {
    const tasks: any[] = await this.camundaService.getCurrentExternalTask(id);
    if (tasks && tasks.length > 0) {
      for (const task of tasks) {
        const topic = task.topicName;
        const tpf = this.createTaskProcessorFunction(payload, task);

        const toStart = await this.check(name, topic);
        if (!toStart) {
          const cmd = new TaskProcessorCommand(id, name, this, tpf, payload);
          await this.regFn(name, topic, new BPMTask(cmd));
        }
      }
    } else {
      // no tasks left
      console.log('tasks array: ');
      if (this.providedVal['ta'].length > 0) {
        for (const t of this.providedVal['ta']) {
          console.log(t);
        }
      }
      console.log('ALL ACTIVITIES PROCESSED - SENDING BROADCAST MESSAGE');
    }
    await this.initWorkers(name);
  }

  private async check(workflowName: string, topic: string): Promise<boolean> {
    const workerMap = await this.workerMapGetter();
    if (workerMap[workflowName]) {
      for (const m of workerMap[workflowName]) {
        if (m.topic == topic && m.running) return true;
      }
    }
    return false;
  }

  public async execWorkflow(
    keyVal: string,
    taskOrEvent: string,
  ): Promise<Workflow | null> {
    let taskOrWorkflowItem;
    switch (taskOrEvent) {
      case 'task':
        taskOrWorkflowItem = await this.findTaskWorkflowByKey(keyVal);
        break;
      case 'event':
        taskOrWorkflowItem = await this.findEventWorkflowByKey(keyVal);
        break;
      default:
        break;
    }
    if (taskOrWorkflowItem) {
      const workflow = await this.findWorkflowByKey(
        taskOrWorkflowItem.workflowKey,
      );
      if (workflow) {
        await this.camundaService.execute(workflow.externalIdentifier, {});
        return workflow;
      }
    }
    return null;
  }

  private async initWorkers(workflowName: string) {
    const workerMap = await this.workerMapGetter();
    if (workerMap?.[workflowName]) {
      const workerList = workerMap[workflowName];
      for (const worker of workerList) {
        if (!worker.running) {
          await this.workerFn(worker);
          worker.running = true;
        }
      }
    }
  }

  private async findTaskWorkflowByKey(
    keyValue: string,
  ): Promise<TaskWorkFlowMapping | null> {
    const filter: Filter<TaskWorkFlowMapping> = {
      where: {
        taskKey: keyValue,
      },
    };

    return this.taskWorkflowMapping.findOne(filter);
  }

  private async findEventWorkflowByKey(
    keyValue: string,
  ): Promise<EventWorkflowMapping | null> {
    const filter: Filter<EventWorkflowMapping> = {
      where: {
        eventKey: keyValue,
      },
    };

    return this.eventWorkflowMappingRepo.findOne(filter);
  }

  private async findWorkflowByKey(keyValue: string): Promise<Workflow | null> {
    const filter: Filter<Workflow> = {
      where: {
        name: keyValue,
      },
    };

    return this.workflowRepo.findOne(filter);
  }
}
