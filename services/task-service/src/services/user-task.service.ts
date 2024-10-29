import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IEvent, IOutgoingConnector, IUserTaskService} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {TaskRepository, UserTaskRepository} from '../repositories';
import {EventType, Source, UserTaskStatus} from '../types';
import {CamundaService} from './camunda.service';

export class UserTaskService implements IUserTaskService {
  constructor(
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
    @repository(UserTaskRepository)
    private readonly userTaskRepo: UserTaskRepository,
    @inject(TaskServiceBindings.OUTGOING_CONNECTOR)
    private readonly outgoing: IOutgoingConnector<IEvent>,
    @service(CamundaService)
    private readonly camundaService: CamundaService,
  ) {}

  async complete(taskId: string, userTaskId: string): Promise<void> {
    const task = await this.taskRepo.findById(taskId);
    const userTask = await this.userTaskRepo.findById(userTaskId);

    await this.camundaService.completeUserTask(userTask.externalId);
    await this.userTaskRepo.updateById(userTaskId, {
      status: UserTaskStatus.Completed,
    });
    if (task.id && task.externalId) {
      await this.updateList(task.id, task.externalId);
    }
    await this.outgoing.publish({
      key: EventType.UserTaskCompleted,
      payload: {
        task,
        userTask,
      },
      timestamp: Date.now(),
      source: Source.TaskService,
    });
  }

  async updateList(taskId: string, instanceId: string): Promise<void> {
    const pendingTasks =
      await this.camundaService.getPendingUserTasks(instanceId);
    if (pendingTasks.length > 0) {
      await this.userTaskRepo.createAll(
        pendingTasks.map(camundaTask => ({
          taskId,
          status: UserTaskStatus.Pending,
          externalId: camundaTask.id,
          name: camundaTask.name,
        })),
      );
    }
  }
}
