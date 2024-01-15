import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../enums/permission-key.enum';
import {Task, TaskWorkflow} from '../models';
import {
  TaskRepository,
  TaskWorkFlowRepository,
  UserTaskRepository,
} from '../repositories';

const baseUrl = 'tasks';

export class TaskController {
  constructor(
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
    @repository(UserTaskRepository)
    private readonly userTaskRepository: UserTaskRepository,
    @repository(TaskWorkFlowRepository)
    private readonly taskWorkflowMapping: TaskWorkFlowRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewTask],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Task model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Task, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Task) filter?: Filter<Task>) {
    return this.taskRepo.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewTask],
  })
  @get(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Task model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Task, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Task, {exclude: 'where'})
    filter?: FilterExcludingWhere<Task>,
  ): Promise<Task> {
    return this.taskRepo.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.ViewTask],
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
  async count(@param.where(Task) where?: Where<Task>): Promise<Count> {
    return this.taskRepo.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [TaskPermssionKey.MapTask]})
  @post(`${baseUrl}/mapping`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async mapTaskToWorkflow(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(TaskWorkflow, {
            title: 'TaskWorkFlowMapping',
          }),
        },
      },
    })
    taskWorkflowMapping: Omit<TaskWorkflow, 'id'>,
  ) {
    await this.taskWorkflowMapping.create(taskWorkflowMapping);
  }

  @authorize({
    permissions: [TaskPermssionKey.DeleteTask],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Task DELETE by id success',
      },
    },
  })
  async deleteById(
    @param.path.string('id') id: string,
    @param.query.boolean('cascade') cascade = true,
  ): Promise<void> {
    if (cascade) {
      await this.userTaskRepository.deleteAllHard({
        taskId: id,
      });
    }
    await this.taskRepo.deleteByIdHard(id);
  }

  @authorize({
    permissions: [TaskPermssionKey.DeleteTask],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @del(`${baseUrl}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tasks DELETE success',
      },
    },
  })
  async delete(
    @param.where(Task) where?: Where<Task>,
    @param.query.boolean('cascade') cascade = true,
  ): Promise<void> {
    if (cascade) {
      const tasks = await this.taskRepo.find({
        where,
        fields: ['id', 'deleted'],
      });
      if (tasks.length) {
        await this.userTaskRepository.deleteAllHard({
          taskId: {
            inq: tasks.map(task => task.id!),
          },
        });
      }
    }
    await this.taskRepo.deleteAllHard(where);
  }
}
