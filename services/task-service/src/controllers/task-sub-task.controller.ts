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
import {HttpErrors, get, getModelSchemaRef, param, patch} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../enums/permission-key.enum';
import {ISubTaskService} from '../interfaces';
import {TaskServiceBindings} from '../keys';
import {SubTask} from '../models';
import {SubTaskRepository, TaskRepository} from '../repositories';

const baseUrl = 'tasks/{taskId}/sub-tasks';

export class TaskSubTaskController {
  constructor(
    @inject(TaskServiceBindings.SUB_TASK_SERVICE)
    private readonly userTaskService: ISubTaskService,
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
    @repository(SubTaskRepository)
    private readonly subTaskRepo: SubTaskRepository,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [TaskPermssionKey.CompleteSubTask]})
  @patch(`${baseUrl}/{subTaskId}/complete`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async completeTask(
    @param.path.string('taskId') id: string,
    @param.path.string('subTaskId') subTaskId: string,
  ): Promise<void> {
    // need to maintain and validate mapping of task and user task
    await this.userTaskService.complete(id, subTaskId);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewTask],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of SubTask model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(SubTask, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('taskId') taskId: string,
    @param.filter(SubTask) filter?: Filter<SubTask>,
  ) {
    return this.taskRepo.subTasks(taskId).find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewSubTask],
  })
  @get(`${baseUrl}/{subTaskId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'SubTask model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(SubTask, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('taskId') taskId: string,
    @param.path.string('subTaskId') subTaskId: string,
    @param.filter(SubTask, {exclude: 'where'})
    filter?: FilterExcludingWhere<SubTask>,
  ): Promise<SubTask> {
    const subTask = await this.taskRepo.subTasks(taskId).find({
      where: {
        id: subTaskId,
      },
      ...filter,
    });
    if (!subTask.length) {
      throw new HttpErrors.NotFound('Sub Task not found');
    }
    return subTask[0];
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewSubTask],
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
    @param.where(SubTask) where?: Where<SubTask>,
  ): Promise<Count> {
    const whereBuilder = new WhereBuilder<SubTask>();
    whereBuilder.and({taskId}).and({...where});
    return this.subTaskRepo.count(whereBuilder.build());
  }
}
