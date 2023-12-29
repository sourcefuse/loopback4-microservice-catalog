import {Context} from '@loopback/core';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SYSTEM_USER} from '../constant';
import {ICommand, IEvent, IOutgoingConnector} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {TaskRepository} from '../repositories';
import {CamundaTaskParameters, EventType, Source, TaskStatus} from '../types';

export class EndTaskCommand implements ICommand {
  topic = 'end-task';
  parameters: CamundaTaskParameters;
  logger: ILogger;
  constructor(private context: Context) {
    this.logger = context.getSync(LOGGER.LOGGER_INJECT);
  }
  async execute(): Promise<void> {
    const job = this.parameters.taskService;
    const variables = this.parameters.task.variables.getAll();
    const taskId = variables.taskId;
    const tempContext = new Context(this.context);
    tempContext.bind(AuthenticationBindings.CURRENT_USER).to(SYSTEM_USER);
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
        type: EventType.TaskCompleted,
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
