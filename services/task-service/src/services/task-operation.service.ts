import {injectable, BindingScope, service, inject} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {CamundaService} from './camunda.service';
import {
  WorkflowServiceBindings,
  WorkerRegisterFn,
  BPMTask,
  WorkerImplementationFn,
} from '@sourceloop/bpmn-service';
import {TaskProcessorCommand} from '../commands';

import {TaskServiceBindings} from '../keys';
import {Task, TaskReturnMap, TaskServiceNames, TaskStatus} from '../types';
import {WorkflowOperationService} from './workflow-operation.service';
import {UtilityService} from './utility.service';
import {TaskDbService} from './task-db.service';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.TRANSIENT})
export class TaskOperationService {
  constructor(
    @service(TaskDbService)
    private readonly taskDbService: TaskDbService,
    @service(CamundaService)
    private readonly camundaService: CamundaService,
    @service(WorkflowOperationService)
    private readonly workflowOpsService: WorkflowOperationService,
    @service(UtilityService)
    private readonly utilityService: UtilityService,
    @inject(WorkflowServiceBindings.RegisterWorkerFunction)
    private readonly regFn: WorkerRegisterFn,
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

  private _createTaskProcessorFunction(
    updatedPayload: AnyObject,
    task: AnyObject,
  ) {
    return (taskOfWorkerFn: AnyObject, taskServiceOfWorkerFn: AnyObject) => {
      // logic given by the consumer to be plugged in
      return this.clientBpmnRunner.workerFunctions[task.topicName](
        taskOfWorkerFn,
        taskServiceOfWorkerFn,
        updatedPayload,
      );
    };
  }

  public async processTask(id: string, name: string, payload?: AnyObject) {
    const tasks: AnyObject[] = await this.camundaService.getCurrentExternalTask(
      id,
    );
    if (tasks && tasks.length > 0) {
      for (const task of tasks) {
        await this._registerOrUpdateCommand(task, {payload, name, id});
      }
    } else {
      if (this.clientBpmnRunner.tasksArray.length > 0) {
        for (const task of this.clientBpmnRunner.tasksArray) {
          await this.taskDbService.addTaskToDB(task);
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
    if (!taskWorkflowMapping)
      throw new HttpErrors.NotFound('No workflow mapped to task');

    const workflow = await this.workflowOpsService.findWorkflowByKey(
      taskWorkflowMapping.workflowKey,
    );
    if (!workflow) throw new HttpErrors.NotFound('No workflow found with key');

    const userTasks: Task[] = await this.camundaService.getCurrentUserTask(
      workflow.externalIdentifier,
    );
    if (!userTasks || userTasks.length === 0) return;

    const transformedPayload = this.utilityService.transformObject(payload);

    for (const ut of userTasks) {
      if (!ut.id) continue;
      await this.camundaService.completeUserTask(ut.id, transformedPayload);

      // check if there are Task tasks left
      const pendingTasks: Task[] = await this.camundaService.getCurrentUserTask(
        workflow.externalIdentifier,
      );
      ut.status =
        pendingTasks.length > 0 ? TaskStatus.in_progress : TaskStatus.completed;

      await this.taskDbService.updateTask(ut);
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
    return this.utilityService.iterateWorkerMap(workflowName, async worker => {
      if (worker.topic === topic && worker.running) {
        if (type === TaskServiceNames.UPDATE && cmd) {
          worker.command = cmd;
          return true;
        } else if (type === TaskServiceNames.CHECK) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    });
  }

  private async _initWorkers(workflowName: string) {
    await this.utilityService.iterateWorkerMap(workflowName, async worker => {
      if (!worker.running) {
        await this.workerFn(worker);
        worker.running = true;
        return true;
      }
      return false;
    });
  }
}
