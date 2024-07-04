import {Context} from '@loopback/core';
import {
  ExecuteWorkflowDto,
  WorkflowController,
  WorkflowRepository,
} from '@sourceloop/bpmn-service';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  ICommand,
  IEvent,
  IOutgoingConnector,
  IUserTaskService,
} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {Task} from '../models';
import {TaskRepository, TaskWorkFlowRepository} from '../repositories';
import {CamundaTaskParameters, EventType, Source, User} from '../types';

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
    const tempContext = new Context(this.context);
    const systemUser = await tempContext.get<User>(
      TaskServiceBindings.SYSTEM_USER,
    );
    tempContext.bind(AuthenticationBindings.CURRENT_USER).to(systemUser);
    try {
      const tasksWithWorkflow = JSON.parse(variables.tasks.values) as Task[];

      let createdTasks: Task[] = [];
      if (tasksWithWorkflow) {
        createdTasks = await this._createTasks(tasksWithWorkflow, tempContext);
      }
      const outgoing = this.context.getSync<IOutgoingConnector<IEvent>>(
        TaskServiceBindings.OUTGOING_CONNECTOR,
      );
      await outgoing.publish({
        key: EventType.TaskCreated,
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
    } finally {
      tempContext.close();
    }
  }

  private async _createTasks(tasks: Task[], context: Context): Promise<Task[]> {
    const taskRepo = context.getSync<TaskRepository>(
      'repositories.TaskRepository',
    );
    const taskWorkflowMappingRepo = context.getSync<TaskWorkFlowRepository>(
      'repositories.TaskWorkFlowRepository',
    );
    let createdTasks: Task[] = [];
    if (tasks.length) {
      createdTasks = await taskRepo.createAll(tasks ?? []);
    }
    const workflowKeys = await taskWorkflowMappingRepo.find({
      where: {
        taskKey: {
          inq: createdTasks.map(task => task.key),
        },
      },
    });
    const workflowKeyMap = new Map<string, Task[] | undefined>();
    createdTasks.forEach(task => {
      const workflowKey = workflowKeys.find(
        key => key.taskKey === task.key,
      )?.workflowKey;
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
      ([workflowKey, tsks]) =>
        this._startWorkflowsForTasks(workflowKey, tsks ?? [], context),
    );
    await Promise.all(promises);
    return createdTasks;
  }

  private async _startWorkflowsForTasks(
    workflowKey: string,
    tasks: Task[],
    context: Context,
  ) {
    const workflowCtrl = await context.get<WorkflowController>(
      'controllers.WorkflowController',
    );
    const workflowRepo = await context.get<WorkflowRepository>(
      'repositories.WorkflowRepository',
    );
    const taskRepo = await context.get<TaskRepository>(
      'repositories.TaskRepository',
    );
    const userTaskService = await context.get<IUserTaskService>(
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
      if (workflow.id) {
        const result = await workflowCtrl.startWorkflow(
          workflow.id,
          new ExecuteWorkflowDto({
            input: {
              taskId: dbTask.id,
            },
          }),
        );
        await userTaskService.updateList(dbTask.id!, result['id']);
        await taskRepo.updateById(dbTask.id!, {
          externalId: result['id'],
        });
      } else {
        this.logger.debug(`No workflow found for key ${workflowKey}`);
      }
    });
    await Promise.all(promises);
  }
}
