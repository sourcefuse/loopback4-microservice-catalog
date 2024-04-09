import {inject, service} from '@loopback/core';
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
  patch,
  HttpErrors,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  ILogger,
  LOGGER,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../enums/permission-key.enum';
import {Task, TaskWorkflow, UserTask} from '../models';
import {
  TaskRepository,
  TaskWorkFlowRepository,
  UserTaskRepository,
} from '../repositories';
import {CamundaService} from '../services';
import {TaskStatus} from '../types';

const baseUrl = 'tasks';

export class TaskController {
  constructor(
    @repository(TaskRepository)
    private readonly taskRepo: TaskRepository,
    @repository(UserTaskRepository)
    private readonly userTaskRepository: UserTaskRepository,
    @repository(TaskWorkFlowRepository)
    private readonly taskWorkflowMapping: TaskWorkFlowRepository,
    @service(CamundaService)
    private readonly camundaService: CamundaService,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
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
    permissions: [TaskPermssionKey.UpdateTask],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Task UPDATE by id success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {partial: true}),
        },
      },
    })
    task: Task,
  ): Promise<void> {
    if (task.status) {
      if (task.status === TaskStatus.Completed) {
        throw HttpErrors.BadRequest(
          'Task completion cannot be done through the PATCH API.',
        );
      }
      const updatedUserTask = new UserTask({status: task.status});
      await this.userTaskRepository.updateAll(updatedUserTask, {
        taskId: id,
      });
    }
    await this.taskRepo.updateById(id, task);
  }

  @authorize({
    permissions: [TaskPermssionKey.UpdateTask],
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @patch(`${baseUrl}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tasks UPDATE success',
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Task, {partial: true}),
        },
      },
    })
    tasks: Task,
    @param.where(Task) where?: Where<Task>,
  ): Promise<Count> {
    if (tasks.status) {
      if (tasks.status === TaskStatus.Completed) {
        throw HttpErrors.BadRequest(
          'Task completion cannot be done through the PATCH API.',
        );
      }
      const existingTasks = await this.taskRepo.find({
        where,
        fields: ['id'],
      });
      if (existingTasks.length) {
        const updatedUserTask = new UserTask({status: tasks.status});
        await this.userTaskRepository.updateAll(updatedUserTask, {
          taskId: {
            inq: existingTasks.map(task => task.id!),
          },
        });
      }
    }
    return this.taskRepo.updateAll(tasks, where);
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
      const task = await this.taskRepo.findById(id);

      await this.userTaskRepository.deleteAllHard({
        taskId: id,
      });

      this.camundaService
        .deleteProcessInstances([task.externalId])
        .catch(error => {
          this.logger.error(
            `Failed to delete process instances on Camunda: ${error}`,
          );
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
        fields: ['id', 'deleted', 'externalId'],
      });

      const processInstanceIds = tasks.map(task => task.externalId);

      if (tasks.length) {
        await this.userTaskRepository.deleteAllHard({
          taskId: {
            inq: tasks.map(task => task.id!),
          },
        });

        this.camundaService
          .deleteProcessInstances(processInstanceIds)
          .catch(error => {
            this.logger.error(
              `Failed to delete process instances on Camunda: ${error}`,
            );
          });
      }
    }

    await this.taskRepo.deleteAllHard(where);
  }
}
