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
import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';

const basePath = '/working-hours';

export class WorkingHourController {
  constructor(
    @repository(WorkingHourRepository)
    public workingHourRepository: WorkingHourRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateWorkingHour]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'WorkingHour model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(WorkingHour)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(WorkingHour, {
            title: 'NewWorkingHour',
            exclude: ['id'],
          }),
        },
      },
    })
    workingHour: Omit<WorkingHour, 'id'>,
  ): Promise<WorkingHour> {
    return this.workingHourRepository.create(workingHour);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewWorkingHour]})
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'WorkingHour model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
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
  @authorize({permissions: [PermissionKey.ViewWorkingHour]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of WorkingHour model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
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
  @authorize({permissions: [PermissionKey.UpdateWorkingHour]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'WorkingHour PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
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
  @authorize({permissions: [PermissionKey.ViewWorkingHour]})
  @get(`${basePath}/{id}`, {
    description:
      'These requests will be available to everyone to look at. This will be represent the work timings for the owner of the calendar.',
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'WorkingHour model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
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
  @authorize({permissions: [PermissionKey.UpdateWorkingHour]})
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'WorkingHour PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
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
  @authorize({permissions: [PermissionKey.UpdateWorkingHour]})
  @put(`${basePath}/{id}`, {
    description: `This api is to update the calendar by passing an \`id\`. This action will be allowed only 
      to the owner of the calendar or the admin. To identify the \`owner\` we 
      will check for the email passed in the token and the corresponding access level, 
      whereas to identify the admin we will check for the permission.`,
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
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
  @authorize({permissions: [PermissionKey.DeleteWorkingHour]})
  @del(`${basePath}/{id}`, {
    description: `This api is to update the calendar by passing an \`id\`. This action will 
      be allowed only to the owner of the calendar or the admin. To identify the ‘owner’ 
      we will check for the email passed in the token and the corresponding access level, 
      whereas to identify the admin we will check for the permission.`,
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'WorkingHour DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.workingHourRepository.deleteById(id);
  }
}
