import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {TaskRepository} from '../repositories/task.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class TaskOperationService {
  constructor(
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
  ) {
    // empty
  }

  /*
   * Add service methods here
   */

  addTaskToDB() {
    // add a task to DB
    this.taskRepo.create({});
  }
}
