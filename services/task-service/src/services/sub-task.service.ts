import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IEvent, IOutgoingConnector, ISubTaskService} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {TaskRepository, UserTaskRepository} from '../repositories';
import {EventType, Source, SubTaskStatus} from '../types';
import {CamundaService} from './camunda.service';

export class SubTaskService implements ISubTaskService {
  constructor(
    @repository(TaskRepository)
    private taskRepo: TaskRepository,
    @repository(UserTaskRepository)
    private subTaskRepo: UserTaskRepository,
    @inject(TaskServiceBindings.OUTGOING_CONNECTOR)
    private readonly outgoing: IOutgoingConnector<IEvent>,
    @service(CamundaService)
    private readonly camundaService: CamundaService,
  ) {}

  async complete(taskId: string, subtaskId: string): Promise<void> {
    const task = await this.taskRepo.findById(taskId);
    const subtask = await this.subTaskRepo.findById(subtaskId);

    await this.camundaService.completeUserTask(subtask.externalId);
    await this.subTaskRepo.updateById(subtaskId, {
      status: SubTaskStatus.Completed,
    });
    if (task.id && task.externalId) {
      await this.updateList(task.id, task.externalId);
    }
    await this.outgoing.publish({
      type: EventType.SubTaskCompleted,
      payload: {
        task,
        subtask,
      },
      timestamp: Date.now(),
      source: Source.TaskService,
    });
  }

  async updateList(taskId: string, instanceId: string): Promise<void> {
    const pendingTasks =
      await this.camundaService.getPendingUserTasks(instanceId);
    if (pendingTasks.length > 0) {
      const createSubTasks = pendingTasks.map(camundaTask =>
        this.subTaskRepo.create({
          taskId,
          status: SubTaskStatus.Pending,
          externalId: camundaTask.id,
          name: camundaTask.name,
        }),
      );
      await Promise.all(createSubTasks);
    }
  }
}
