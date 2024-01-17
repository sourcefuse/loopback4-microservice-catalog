import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  WhereBuilder,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../enums/permission-key.enum';
import {IUserTaskService} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {UserTask} from '../models';
import {TaskRepository, UserTaskRepository} from '../repositories';

const baseUrl = 'tasks/{taskId}/user-tasks';

export class TaskUserTaskController {
  constructor(
    @inject(TaskServiceBindings.SUB_TASK_SERVICE)
    private readonly userTaskService: IUserTaskService,
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
    @repository(UserTaskRepository)
    private readonly userTaskRepo: UserTaskRepository,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [TaskPermssionKey.CompleteUserTask]})
  @patch(`${baseUrl}/{userTaskId}/complete`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async completeTask(
    @param.path.string('taskId') id: string,
    @param.path.string('userTaskId') userTaskId: string,
  ): Promise<void> {
    // need to maintain and validate mapping of task and user task
    await this.userTaskService.complete(id, userTaskId);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewUserTask],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of UserTask model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserTask, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('taskId') taskId: string,
    @param.filter(UserTask) filter?: Filter<UserTask>,
  ) {
    return this.taskRepo.userTasks(taskId).find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewUserTask],
  })
  @get(`${baseUrl}/{userTaskId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'UserTask model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(UserTask, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('taskId') taskId: string,
    @param.path.string('userTaskId') userTaskId: string,
    @param.filter(UserTask, {exclude: 'where'})
    filter?: FilterExcludingWhere<UserTask>,
  ): Promise<UserTask> {
    const userTask = await this.taskRepo.userTasks(taskId).find({
      where: {
        id: userTaskId,
      },
      ...filter,
    });
    if (!userTask.length) {
      throw new HttpErrors.NotFound('User Task not found');
    }
    return userTask[0];
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewUserTask],
  })
  @get(`${baseUrl}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Task model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.path.string('taskId') taskId: string,
    @param.where(UserTask) where?: Where<UserTask>,
  ): Promise<Count> {
    const whereBuilder = new WhereBuilder<UserTask>();
    whereBuilder.and({taskId}).and({...where});
    return this.userTaskRepo.count(whereBuilder.build());
  }

  @authorize({
    permissions: [TaskPermssionKey.DeleteUserTask],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'UserTasks DELETE by id success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userTaskRepo.deleteByIdHard(id);
  }

  @authorize({
    permissions: [TaskPermssionKey.DeleteUserTask],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${baseUrl}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'UserTasks DELETE success',
      },
    },
  })
  async delete(@param.where(UserTask) where?: Where<UserTask>): Promise<void> {
    await this.userTaskRepo.deleteAllHard(where);
  }
}
