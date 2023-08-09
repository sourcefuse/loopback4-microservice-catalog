import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
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

  public async addTaskToDB(task: AnyObject) {
    // add a task to DB
    // await this.taskRepo.create(task);
    console.log(`Add task to DB ${task.type} ${task.topic}`);
  }
}
