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
import {Attendee} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {AttendeeRepository} from '../repositories';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';

const basePath = '/attendees';

export class AttendeeController {
  constructor(
    @repository(AttendeeRepository)
    public attendeeRepository: AttendeeRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateAttendee]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attendee model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Attendee)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attendee, {
            title: 'NewAttendee',
            exclude: ['id'],
          }),
        },
      },
    })
    attendee: Omit<Attendee, 'id'>,
  ): Promise<Attendee> {
    return this.attendeeRepository.create(attendee);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewAttendee]})
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attendee model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Attendee) where?: Where<Attendee>): Promise<Count> {
    return this.attendeeRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewAttendee]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Attendee model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Attendee, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Attendee) filter?: Filter<Attendee>,
  ): Promise<Attendee[]> {
    return this.attendeeRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateAttendee]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attendee PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attendee, {partial: true}),
        },
      },
    })
    attendee: Attendee,
    @param.where(Attendee) where?: Where<Attendee>,
  ): Promise<Count> {
    return this.attendeeRepository.updateAll(attendee, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewAttendee]})
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attendee model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Attendee, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Attendee, {exclude: 'where'})
    filter?: FilterExcludingWhere<Attendee>,
  ): Promise<Attendee> {
    return this.attendeeRepository.findById(id, filter);
  }
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateAttendee]})
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Attendee PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Attendee, {partial: true}),
        },
      },
    })
    attendee: Attendee,
  ): Promise<void> {
    await this.attendeeRepository.updateById(id, attendee);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateAttendee]})
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Attendee PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() attendee: Attendee,
  ): Promise<void> {
    await this.attendeeRepository.replaceById(id, attendee);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteAttendee]})
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Attendee DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.attendeeRepository.deleteById(id);
  }
}
