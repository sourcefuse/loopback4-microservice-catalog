import {
  injectable,
  BindingScope,
  service,
  inject,
  Getter,
} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {TaskRepository} from '../repositories/task.repository';
import {CamundaService} from './camunda.service';
import {
  WorkflowServiceBindings,
  WorkerRegisterFn,
  BPMTask,
  WorkerMap,
  WorkerImplementationFn,
} from '@sourceloop/bpmn-service';
import {TaskProcessorCommand} from '../commands';

import {TaskServiceBindings} from '../keys';
import {Task, TaskReturnMap, TaskServiceNames} from '../types';
import {WorkflowOperationService} from './workflow-operation.service';
import {UtilityService} from './utility-service';

@injectable({scope: BindingScope.TRANSIENT})
export class TaskOperationService {
  constructor(
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
    @service(CamundaService)
    private readonly camundaService: CamundaService,
    @service(WorkflowOperationService)
    private readonly workflowOpsService: WorkflowOperationService,
    @service(UtilityService)
    private readonly utilityService: UtilityService,
    @inject(WorkflowServiceBindings.RegisterWorkerFunction)
    private readonly regFn: WorkerRegisterFn,
    @inject.getter(WorkflowServiceBindings.WORKER_MAP)
    private readonly workerMapGetter: Getter<WorkerMap>,
    @inject(WorkflowServiceBindings.WorkerImplementationFunction)
    private readonly workerFn: WorkerImplementationFn,
    @inject(TaskServiceBindings.CUSTOM_BPMN_RUNNER)
    private readonly customBpmnRunner: TaskReturnMap,
  ) {
    this.clientBpmnRunner = this.customBpmnRunner;
  }

  clientBpmnRunner: TaskReturnMap = {
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

  private _createTaskProcessorFunction(updatedPayload: any, task: any) {
    return (taskOfWorkerFn: any, taskServiceOfWorkerFn: any) => {
      // logic given by the consumer to be plugged in
      return this.clientBpmnRunner.workerFunctions[task.topicName](
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
        await this._registerOrUpdateCommand(task, {payload, name, id});
      }
    } else {
      if (this.clientBpmnRunner.tasksArray.length > 0) {
        for (const task of this.clientBpmnRunner.tasksArray) {
          await this.addTaskToDB(task);
          await this.workflowOpsService.execWorkflow(
            task.key,
            TaskServiceNames.TASK,
          );
        }
      }

      this.clientBpmnRunner.tasksArray.length = 0;
    }
    await this._initWorkers(name);
  }

  public async taskUpdateFlow(taskKey: string, payload?: AnyObject) {
    const taskWorkflowMapping =
      await this.workflowOpsService.findTaskWorkflowByKey(taskKey);
    if (taskWorkflowMapping) {
      const workflow = await this.workflowOpsService.findWorkflowByKey(
        taskWorkflowMapping.workflowKey,
      );
      if (workflow) {
        const userTasks: any[] = await this.camundaService.getCurrentUserTask(
          workflow.externalIdentifier,
        );
        if (userTasks && userTasks.length > 0) {
          // match the variables
          for (const ut of userTasks) {
            const transformedPayload =
              this.utilityService.transformObject(payload);
            await this.camundaService.completeUserTask(
              ut.id,
              transformedPayload,
            );
            // update the task data in the db
          }
        }
      }
    }
  }

  private async _registerOrUpdateCommand(task: AnyObject, data: AnyObject) {
    const topic = task.topicName;
    const tpf = this._createTaskProcessorFunction(data.payload, task);

    const toStart = await this._runCommand(
      TaskServiceNames.CHECK,
      data.name,
      topic,
    );
    const cmd = new TaskProcessorCommand(data.id, data.name, this, tpf);
    if (!toStart) {
      await this.regFn(data.name, topic, new BPMTask(cmd));
    } else {
      await this._runCommand(
        TaskServiceNames.UPDATE,
        data.name,
        task.topicName,
        new BPMTask(cmd),
      );
    }
  }

  private async _runCommand(
    type: string,
    workflowName: string,
    topic: string,
    cmd?: BPMTask<AnyObject, AnyObject>,
  ): Promise<boolean> {
    const workerMap = await this.workerMapGetter();
    if (workerMap[workflowName]) {
      for (const m of workerMap[workflowName]) {
        if (m.topic == topic && m.running) {
          if (type == TaskServiceNames.UPDATE && cmd) {
            m.command = cmd;
            return true;
          } else if (type == TaskServiceNames.CHECK) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private async _initWorkers(workflowName: string) {
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
}
