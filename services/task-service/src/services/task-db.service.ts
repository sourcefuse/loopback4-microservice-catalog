import {BindingScope, injectable} from '@loopback/context';
import {repository} from '@loopback/repository';
import {TaskRepository} from '../repositories';
import {Task} from '../types';

@injectable({
  scope: BindingScope.TRANSIENT,
})
export class TaskDbService {
  constructor(
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
  ) {}

  public async updateTaskStatus(key: string, task: Task) {
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
}
