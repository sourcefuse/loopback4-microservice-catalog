import {Context} from '@loopback/core';
import {
  ExecuteWorkflowDto,
  WorkflowController,
  WorkflowRepository,
} from '@sourceloop/bpmn-service';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SYSTEM_USER} from '../constant';
import {
  ICommand,
  IEvent,
  IOutgoingConnector,
  ISubTaskService,
} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {Task} from '../models';
import {TaskRepository, TaskWorkFlowMappingRepository} from '../repositories';
import {CamundaTaskParameters, EventType, Source} from '../types';

export class CreateTaskCommand implements ICommand {
  topic = 'create-tasks';
  parameters: CamundaTaskParameters;
  logger: ILogger;
  constructor(private context: Context) {
    this.logger = context.getSync(LOGGER.LOGGER_INJECT);
  }
  async execute(): Promise<void> {
    const job = this.parameters.taskService;
    const variables = this.parameters.task.variables.getAll();
    try {
      const tasksWithWorkflow = JSON.parse(variables.tasks) as Task[];

      let createdTasks: Task[] = [];
      if (tasksWithWorkflow) {
        createdTasks = await this._createTasks(tasksWithWorkflow);
      }
      const outgoing = this.context.getSync<IOutgoingConnector<IEvent>>(
        TaskServiceBindings.OUTGOING_CONNECTOR,
      );
      await outgoing.publish({
        type: EventType.TaskCreated,
        payload: {createdTasks},
        timestamp: Date.now(),
        source: Source.TaskService,
      });
      await job.complete(this.parameters.task);
    } catch (e) {
      await job.handleFailure(this.parameters.task, {
        errorMessage: e.message,
        errorDetails: e.stack,
      });
    }
  }

  private async _createTasks(tasks: Task[]): Promise<Task[]> {
    const taskRepo = this.context.getSync<TaskRepository>(
      'repositories.TaskRepository',
    );
    const taskWorkflowMappingRepo =
      this.context.getSync<TaskWorkFlowMappingRepository>(
        'repositories.TaskWorkFlowMappingRepository',
      );
    const createdTasks = await taskRepo.createAll(tasks ?? []);
    const workflowKeys = await taskWorkflowMappingRepo.find({
      where: {
        taskKey: {
          inq: createdTasks.map(task => task.key),
        },
      },
    });
    const workflowKeyMap = new Map<string, Task[] | undefined>();
    createdTasks.forEach(task => {
      const workflowKey = workflowKeys.find(key => key.taskKey === task.key)
        ?.workflowKey;
      if (workflowKey) {
        const mappedTasks = workflowKeyMap.get(workflowKey);
        if (mappedTasks) {
          mappedTasks.push(task);
        } else {
          workflowKeyMap.set(workflowKey, [task]);
        }
      }
    });
    const promises = Array.from(workflowKeyMap.entries()).map(
      async ([workflowKey, tsks]) => {
        await this._startWorkflowsForTasks(workflowKey, tsks ?? []);
      },
    );
    await Promise.all(promises);
    return createdTasks;
  }

  private async _startWorkflowsForTasks(workflowKey: string, tasks: Task[]) {
    const childContext = new Context(this.context, 'temp-ctx-for-task');
    childContext.bind(AuthenticationBindings.CURRENT_USER).to(SYSTEM_USER);
    const workflowCtrl = await childContext.get<WorkflowController>(
      'controllers.WorkflowController',
    );
    const workflowRepo = await childContext.get<WorkflowRepository>(
      'repositories.WorkflowRepository',
    );
    const taskRepo = await childContext.get<TaskRepository>(
      'repositories.TaskRepository',
    );
    const subtaskService = await childContext.get<ISubTaskService>(
      TaskServiceBindings.SUB_TASK_SERVICE,
    );
    const workflow = await workflowRepo.findOne({
      where: {
        externalIdentifier: workflowKey,
      },
    });
    if (!workflow) {
      this.logger.debug(`No workflow found for key ${workflowKey}`);
      return;
    }
    const promises = tasks.map(async dbTask => {
      const result = await workflowCtrl.startWorkflow(
        workflow.id!,
        new ExecuteWorkflowDto({
          input: {
            taskId: dbTask.id,
          },
        }),
      );
      await subtaskService.updateList(dbTask.id!, result['id']);
      await taskRepo.updateById(dbTask.id!, {
        externalId: result['id'],
      });
    });
    await Promise.all(promises);
  }
}
