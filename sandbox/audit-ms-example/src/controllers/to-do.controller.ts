import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permissions.enum';
import {ToDo} from '../models';
import {ToDoRepository} from '../repositories';

const OK = 200;
const NOCONTENT = 204;
const BASE = '/to-dos';
export class ToDoController {
  constructor(
    @repository(ToDoRepository)
    public toDoRepository: ToDoRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateTodo]})
  @post(BASE)
  @response(OK, {
    description: 'ToDo model instance',
    content: {'application/json': {schema: getModelSchemaRef(ToDo)}},
  })
  async create(
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
    return this.toDoRepository.create(toDo);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(`${BASE}/count`)
  @response(OK, {
    description: 'ToDo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(ToDo) where?: Where<ToDo>): Promise<Count> {
    return this.toDoRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(BASE)
  @response(OK, {
    description: 'Array of ToDo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ToDo, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(ToDo) filter?: Filter<ToDo>): Promise<ToDo[]> {
    return this.toDoRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateTodo]})
  @patch(BASE)
  @response(OK, {
    description: 'ToDo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ToDo, {partial: true}),
        },
      },
    })
    toDo: ToDo,
    @param.where(ToDo) where?: Where<ToDo>,
  ): Promise<Count> {
    return this.toDoRepository.updateAll(toDo, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(`${BASE}/{id}`)
  @response(OK, {
    description: 'ToDo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ToDo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ToDo, {exclude: 'where'}) filter?: FilterExcludingWhere<ToDo>,
  ): Promise<ToDo> {
    return this.toDoRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateTodo]})
  @patch(`${BASE}/{id}`)
  @response(NOCONTENT, {
    description: 'ToDo PATCH success',
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

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateTodo]})
  @put(`${BASE}/{id}`)
  @response(NOCONTENT, {
    description: 'ToDo PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() toDo: ToDo,
  ): Promise<void> {
    await this.toDoRepository.replaceById(id, toDo);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteTodo]})
  @del(`${BASE}/{id}`)
  @response(NOCONTENT, {
    description: 'ToDo DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.toDoRepository.deleteById(id);
  }
}
