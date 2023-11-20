import {BindingScope, inject, injectable, service} from '@loopback/core';
import {AnyObject, DataObject, repository} from '@loopback/repository';
import {
  BPMTask,
  Variable,
  WorkerImplementationFn,
  WorkerRegisterFn,
  WorkflowServiceBindings,
} from '@sourceloop/bpmn-service';
import {TaskProcessorCommand} from '../commands';

import {HttpErrors} from '@loopback/rest';
import {
  TaskOperationServiceInterface,
  UtilityServiceInterface,
  WebhookServiceInterface,
  WorkflowOperationServiceInterface,
} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {MessageDTO} from '../models';
import {WorkflowProvider} from '../providers';
import {TaskRepository} from '../repositories';
import {
  Task,
  TaskReturnMap,
  TaskServiceNames,
  TaskStatus,
  TaskType,
} from '../types';
import {UtilityService} from './utility.service';
import {WebhookService} from './webhook.service';
import {WorkflowOperationService} from './workflow-operation.service';

@injectable({scope: BindingScope.TRANSIENT})
export class TaskOperationService implements TaskOperationServiceInterface {
  private getWorkflowTasksById: <T>(type: TaskType, id: string) => Promise<T[]>;
  private completeWorkflowTask: (
    type: TaskType,
    id: string,
    variables?: Variable,
  ) => Promise<void>;

  constructor(
    @service(WorkflowOperationService)
    private readonly workflowOpsService: WorkflowOperationServiceInterface,
    @service(UtilityService)
    private readonly utilityService: UtilityServiceInterface,
    @inject(WorkflowServiceBindings.RegisterWorkerFunction)
    private readonly regFn: WorkerRegisterFn,
    @inject(WorkflowServiceBindings.WorkerImplementationFunction)
    private readonly workerFn: WorkerImplementationFn,
    @inject(TaskServiceBindings.CUSTOM_BPMN_RUNNER)
    private readonly customBpmnRunner: TaskReturnMap,
    @service(WebhookService)
    private readonly webhookService: WebhookServiceInterface,
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
    @inject(TaskServiceBindings.TASK_WORKFLOW_MANAGER)
    private readonly taskWorkflowManager: WorkflowProvider,
  ) {
    this.clientBpmnRunner = this.customBpmnRunner;
    const {getWorkflowTasksById, completeWorkflowTask} =
      this.taskWorkflowManager.value();
    this.getWorkflowTasksById = getWorkflowTasksById;
    this.completeWorkflowTask = completeWorkflowTask;
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

  public async processTask(
    id: string,
    name: string,
    key: string,
    payload?: AnyObject,
  ) {
    const tasks: AnyObject[] = await this.getWorkflowTasksById(
      TaskType.External,
      id,
    );
    if (tasks && tasks.length > 0) {
      const tasksPromises = tasks.map(task =>
        this._registerOrUpdateCommand(task, {key, payload, name, id}),
      );
      await Promise.all(tasksPromises);
    } else {
      if (this.clientBpmnRunner.tasksArray.length > 0) {
        const tasksArrayPromises = this.clientBpmnRunner.tasksArray.map(task =>
          this._createTaskAndExecuteWorkflow(task),
        );
        await Promise.all(tasksArrayPromises);
      }

      if (payload) {
        const messageDTO: DataObject<MessageDTO> = {
          message: 'Event Proccessed',
          key: key,
          payload,
          eventKey: key,
          taskKey: 'none',
        };
        await this.webhookService.triggerWebhook(key, messageDTO);
      }
      this.clientBpmnRunner.tasksArray.length = 0;
    }

    await this._initWorkers(name);
  }

  public async taskUpdateFlow(taskKey: string, payload?: AnyObject) {
    try {
      const taskWorkflowMapping =
        await this.workflowOpsService.findTaskWorkflowByKey(taskKey);
      if (!taskWorkflowMapping)
        throw new HttpErrors.NotFound('No workflow mapped to task');

      const workflow = await this.workflowOpsService.findWorkflowByKey(
        taskWorkflowMapping.workflowKey,
      );
      if (!workflow)
        throw new HttpErrors.NotFound('No workflow found with key');
      const userTasks: Task[] = await this.getWorkflowTasksById(
        TaskType.User,
        workflow.externalIdentifier,
      );
      if (!userTasks || userTasks.length === 0) return;

      const transformedPayload = this.utilityService.transformObject(payload);

      for (const ut of userTasks) {
        if (!ut.id) continue;
        await this.completeWorkflowTask(
          TaskType.User,
          ut.id,
          transformedPayload,
        );

        // check if there are Task tasks left
        const pendingTasks: Task[] = await this.getWorkflowTasksById(
          TaskType.User,
          workflow.externalIdentifier,
        );
        ut.status =
          pendingTasks?.length > 0
            ? TaskStatus.in_progress
            : TaskStatus.completed;

        await this.updateTaskStatus(taskKey, ut);
        if (payload) {
          const messageDTO: DataObject<MessageDTO> = {
            message: 'Event Proccessed',
            key: taskKey,
            payload,
            eventKey: 'none',
            taskKey: taskKey,
          };

          await this.webhookService.triggerWebhook(taskKey, messageDTO);
        }
      }
    } catch (error) {
      throw new HttpErrors.InternalServerError(`could not update the task`);
    }
  }

  private async updateTaskStatus(key: string, task: Task) {
    const dbTask = await this.taskRepo.findOne({
      where: {
        key,
      },
    });

    if (dbTask) {
      dbTask.status = task.status;
      await this.taskRepo.update(dbTask);
    }
  }

  private async _registerOrUpdateCommand(task: AnyObject, data: AnyObject) {
    const topic = task.topicName;
    const taskProcessorFn = this._createTaskProcessorFunction(
      data.payload,
      task,
    );

    const toStart = await this._runCommand(
      TaskServiceNames.CHECK,
      data.name,
      topic,
    );
    const cmd = new TaskProcessorCommand(
      taskProcessorFn,
      this.processTask.bind(this),
      [data.id, data.name, data.key],
    );
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

  private async _createTaskAndExecuteWorkflow(task: Task) {
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

    await this.workflowOpsService.execWorkflow(task.key, TaskServiceNames.TASK);
  }
}
