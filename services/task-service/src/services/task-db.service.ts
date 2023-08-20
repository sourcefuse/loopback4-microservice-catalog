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

  public async addTaskToDB(task: Task) {
    // add a task to DB
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
  }
}
