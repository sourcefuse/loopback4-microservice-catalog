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
  param,
  getModelSchemaRef,
  requestBody,
} from '@loopback/rest';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize, IAuthUserWithPermissions} from 'loopback4-authorization';
import {ToDo} from '../models';
import {ToDoRepository, UserLevelResourceRepository} from '../repositories';
import {PermissionKey} from '../enums';
import {bind, BindingScope, inject} from '@loopback/core';
import {UserLevelResource} from '../models';
import { sourceloopDelete, sourceloopGet, sourceloopPatch, sourceloopPost } from '@sourceloop/core';

const BASE_PATH = '/todos';

@bind({scope: BindingScope.TRANSIENT})
export class TodoController {
  constructor(
    @repository(ToDoRepository)
    public toDoRepository: ToDoRepository,
    @repository(UserLevelResourceRepository)
    public userLevelResourceRepo: UserLevelResourceRepository,
  ) {}


  @sourceloopPost(BASE_PATH, {
    responses: {
      '200': {
        description: 'ToDo model instance',
        content: {'application/json': {schema: getModelSchemaRef(ToDo)}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoCreator]})
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


  @sourceloopGet(`${BASE_PATH}/count`, {
    responses: {
      '200': {
        description: 'ToDo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
  async count(@param.where(ToDo) where?: Where<ToDo>): Promise<Count> {
    return this.toDoRepository.count(where);
  }

  @sourceloopGet(BASE_PATH, {
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
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
  async find(@param.filter(ToDo) filter?: Filter<ToDo>): Promise<ToDo[]> {
    return this.toDoRepository.find(filter);
  }

  @sourceloopGet(`${BASE_PATH}/{id}`, {
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
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ToDo, {exclude: 'where'}) filter?: FilterExcludingWhere<ToDo>,
  ): Promise<ToDo> {
    return this.toDoRepository.findById(id, filter);
  }

  @sourceloopPatch(`${BASE_PATH}/{id}`, {
    responses: {
      '204': {
        description: 'ToDo PATCH success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
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

  @sourceloopDelete(`${BASE_PATH}/{id}`, {
    responses: {
      '204': {
        description: 'ToDo DELETE success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.TodoOwner]})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.toDoRepository.deleteById(id);
  }
}
