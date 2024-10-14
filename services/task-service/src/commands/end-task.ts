import {Context} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {ICommand, IEvent, IOutgoingConnector} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {TaskRepository} from '../repositories';
import {
  CamundaTaskParameters,
  EventType,
  Source,
  TaskStatus,
  User,
} from '../types';

export class EndTaskCommand implements ICommand {
  topic = 'end-task';
  parameters: CamundaTaskParameters;
  logger: ILogger;
  constructor(private readonly context: Context) {
    this.logger = context.getSync(LOGGER.LOGGER_INJECT);
  }
  async execute(): Promise<void> {
    const job = this.parameters.taskService;
    const variables = this.parameters.task.variables.getAll();
    const taskId = variables.taskId;
    const tempContext = new Context(this.context);
    const systemUser = await tempContext.get<User>(
      TaskServiceBindings.SYSTEM_USER,
    );
    tempContext.bind(AuthenticationBindings.CURRENT_USER).to(systemUser);
    try {
      const taskRepo = tempContext.getSync<TaskRepository>(
        'repositories.TaskRepository',
      );
      const outgoing = tempContext.getSync<IOutgoingConnector<IEvent>>(
        TaskServiceBindings.OUTGOING_CONNECTOR,
      );
      await taskRepo.updateById(taskId, {
        status: TaskStatus.Completed,
      });
      await outgoing.publish({
        key: EventType.TaskCompleted,
        payload: {
          taskId: taskId,
        },
        timestamp: Date.now(),
        source: Source.TaskService,
      });
      await job.complete(this.parameters.task);
    } catch (err) {
      await job.handleFailure(this.parameters.task, {
        errorMessage: err.message,
        errorDetails: err.stack,
      });
    } finally {
      tempContext.close();
    }
  }
}
