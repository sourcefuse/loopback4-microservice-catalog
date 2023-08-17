import {
  injectable,
  BindingScope,
  service,
  inject,
  Getter,
} from '@loopback/core';
import {AnyObject, Filter, repository} from '@loopback/repository';
import {TaskRepository} from '../repositories/task.repository';
import {EventWorkflowMapping, TaskWorkFlowMapping} from '../models';
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
import {Task, TaskReturnMap, TaskType} from '../types';

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
    @inject(TaskServiceBindings.CUSTOM_BPMN_RUNNER)
    private readonly bpmnRunner: TaskReturnMap,
  ) {
    this.providedVal = this.bpmnRunner;
  }

  providedVal: TaskReturnMap = {
    workerFunctions: {},
    tasksArray: [],
  };

  private async addTaskToDB(task: Task) {
    // add a task to DB
    await this.taskRepo.create({
      key: task.key,
      name: task.name,
      description: task.description,
      status: task.status,
      severity: task.severity,
      priority: task.priority,
      type: task.type,
      assigneeId: task.assigneeId,
      startDate: task.startDate,
      dueDate: task.dueDate,
      endDate: task.endDate,
    });
  }

  private createTaskProcessorFunction(updatedPayload: any, task: any) {
    return (taskOfWorkerFn: any, taskServiceOfWorkerFn: any) => {
      // logic given by the consumer to be plugged in
      return this.providedVal.workerFunctions[task.topicName](
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
        await this.registerOrUpdateCommand(task, {payload, name, id});
      }
    } else {
      // no tasks left
      console.log('ALL ACTIVITIES PROCESSED - SENDING BROADCAST MESSAGE');
      // add tasks to db
      if (this.providedVal.tasksArray.length > 0) {
        for (const task of this.providedVal.tasksArray) {
          // await this.addTaskToDB(task);
          // execute the tasks workflows
          // console.log(task);
          // await this.execWorkflow(task.key, 'task');
        }
      }

      // reset tasks array
      this.providedVal.tasksArray.length = 0;
    }
    await this.initWorkers(name);
  }

  private async registerOrUpdateCommand(task: AnyObject, data: AnyObject) {
    const topic = task.topicName;
    const tpf = this.createTaskProcessorFunction(data.payload, task);

    const toStart = await this.check(data.name, topic);
    const cmd = new TaskProcessorCommand(data.id, data.name, this, tpf);
    if (!toStart) {
      await this.regFn(data.name, topic, new BPMTask(cmd));
    } else {
      await this.updateCommand(data.name, task.topicName, new BPMTask(cmd));
    }
  }

  private async updateCommand(
    workflowName: string,
    topic: string,
    cmd: BPMTask<AnyObject, AnyObject>,
  ) {
    const workerMap = await this.workerMapGetter();
    if (workerMap[workflowName]) {
      for (const m of workerMap[workflowName]) {
        if (m.topic == topic && m.running) {
          // change the command
          m.command = cmd;
          return;
        }
      }
    }
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
