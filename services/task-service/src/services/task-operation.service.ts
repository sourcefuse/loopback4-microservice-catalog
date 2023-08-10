import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {TaskRepository} from '../repositories/task.repository';
import {Tasks} from '../models';

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
    console.log('ADD task to DB - ', task.topic);
    // await this.taskRepo.create({
    //   key: task.topic,
    //   name: 'dummy task - workflow',
    //   status: 's',
    //   severity: 's',
    //   priority: 's',
    //   type: task.type,
    //   assigneeId: '12345',
    // });
  }
}
