import {Context} from '@loopback/context';
import {AnyObject} from '@loopback/repository';
import {ICommand} from '@sourceloop/bpmn-service';
import {ILogger, LOGGER} from '@sourceloop/core';
import {IEvent, IOutgoingConnector} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {TaskRepository} from '../repositories';
import {EventType, Source, TaskStatus} from '../types';

export class EndTaskCommand implements ICommand {
  topic = 'end-task';
  parameters: AnyObject;
  logger: ILogger;
  constructor(private context: Context) {
    this.logger = context.getSync(LOGGER.LOGGER_INJECT);
  }
  async execute(): Promise<void> {
    const job = this.parameters.taskService;
    const variables = this.parameters.task.variables.getAll();
    const taskId = variables.taskId;
    try {
      const taskRepo = this.context.getSync<TaskRepository>(
        'repositories.TaskRepository',
      );
      const outgoing = this.context.getSync<IOutgoingConnector<IEvent>>(
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
      await await job.complete(this.parameters.task);
    } catch (err) {
      await job.handleFailure(this.parameters.task, {
        message: err.message,
      });
    }
  }
}
