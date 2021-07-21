import {
  AnyObject,
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
} from '@loopback/rest';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize, IAuthUserWithPermissions} from 'loopback4-authorization';
import {ToDo, UserLevelResource} from '../models';
import {ToDoRepository, UserLevelResourceRepository} from '../repositories';
import {PermissionKey} from '../enums';
import {bind, BindingScope, inject} from '@loopback/core';

const BASE_PATH = '/todos';

@bind({scope: BindingScope.TRANSIENT})
export class TodoController {
  constructor(
    @repository(ToDoRepository)
    public toDoRepository: ToDoRepository,
    @repository(UserLevelResourceRepository)
    public userLevelResourceRepo: UserLevelResourceRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoCreator]})
  @post(BASE_PATH, {
    responses: {
      '200': {
        description: 'ToDo model instance',
        content: {'application/json': {schema: getModelSchemaRef(ToDo)}},
      },
    },
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToDo, {
            title: 'NewToDo',
            exclude: ['id'],
          }),
        },
      },
    })
    toDo: Omit<ToDo, 'id'>,
  ): Promise<ToDo> {
    const todoCreated = await this.toDoRepository.create(toDo);
    await this.userLevelResourceRepo.create(
      new UserLevelResource({
        resourceName: PermissionKey.TodoOwner,
        resourceValue: todoCreated.id,
        userTenantId: (currentUser as AnyObject)?.userTenantId,
      }),
    );
    return todoCreated;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
  @get(`${BASE_PATH}/count`, {
    responses: {
      '200': {
        description: 'ToDo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(ToDo) where?: Where<ToDo>): Promise<Count> {
    return this.toDoRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
  @get(BASE_PATH, {
    responses: {
      '200': {
        description: 'Array of ToDo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(ToDo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(ToDo) filter?: Filter<ToDo>): Promise<ToDo[]> {
    return this.toDoRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
  @get(`${BASE_PATH}/{id}`, {
    responses: {
      '200': {
        description: 'ToDo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ToDo, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ToDo, {exclude: 'where'}) filter?: FilterExcludingWhere<ToDo>,
  ): Promise<ToDo> {
    return this.toDoRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
  @patch(`${BASE_PATH}/{id}`, {
    responses: {
      '204': {
        description: 'ToDo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToDo, {partial: true}),
        },
      },
    })
    toDo: ToDo,
  ): Promise<void> {
    await this.toDoRepository.updateById(id, toDo);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
  @del(`${BASE_PATH}/{id}`, {
    responses: {
      '204': {
        description: 'ToDo DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.toDoRepository.deleteById(id);
  }
}
