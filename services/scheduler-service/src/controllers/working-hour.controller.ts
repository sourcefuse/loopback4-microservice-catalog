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
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {WorkingHour} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {WorkingHourRepository} from '../repositories';

const basePath = '/working-hours';

export class WorkingHourController {
  constructor(
    @repository(WorkingHourRepository)
    public workingHourRepository: WorkingHourRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateWorkingHour])
  @post(basePath, {
    responses: {
      '200': {
        description: 'WorkingHour model instance',
        content: {'application/json': {schema: getModelSchemaRef(WorkingHour)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkingHour, {
            title: 'NewWorkingHour',
          }),
        },
      },
    })
    workingHour: WorkingHour,
  ): Promise<WorkingHour> {
    return this.workingHourRepository.create(workingHour);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewWorkingHour])
  @get(`${basePath}/count`, {
    responses: {
      '200': {
        description: 'WorkingHour model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(WorkingHour) where?: Where<WorkingHour>,
  ): Promise<Count> {
    return this.workingHourRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewWorkingHour])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Array of WorkingHour model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(WorkingHour, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(WorkingHour) filter?: Filter<WorkingHour>,
  ): Promise<WorkingHour[]> {
    return this.workingHourRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateWorkingHour])
  @patch(basePath, {
    responses: {
      '200': {
        description: 'WorkingHour PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkingHour, {partial: true}),
        },
      },
    })
    workingHour: WorkingHour,
    @param.where(WorkingHour) where?: Where<WorkingHour>,
  ): Promise<Count> {
    return this.workingHourRepository.updateAll(workingHour, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewWorkingHour])
  @get(`${basePath}/{id}`, {
    responses: {
      '200': {
        description: 'WorkingHour model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(WorkingHour, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(WorkingHour, {exclude: 'where'})
    filter?: FilterExcludingWhere<WorkingHour>,
  ): Promise<WorkingHour> {
    return this.workingHourRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateWorkingHour])
  @patch(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'WorkingHour PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WorkingHour, {partial: true}),
        },
      },
    })
    workingHour: WorkingHour,
  ): Promise<void> {
    await this.workingHourRepository.updateById(id, workingHour);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateWorkingHour])
  @put(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'WorkingHour PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() workingHour: WorkingHour,
  ): Promise<void> {
    await this.workingHourRepository.replaceById(id, workingHour);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteWorkingHour])
  @del(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'WorkingHour DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.workingHourRepository.deleteById(id);
  }
}
