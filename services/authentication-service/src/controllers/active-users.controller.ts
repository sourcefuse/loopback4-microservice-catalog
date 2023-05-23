import {
  Count,
  CountSchema,
  Filter,
  Where,
  repository,
} from '@loopback/repository';
import {ActiveUsersRepository} from '../repositories';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {ActiveUsers} from '../models';
import {PermissionKey} from '../enums';

const baseUrl = '/active-users';

export class ActiveUsersController {
  constructor(
    @repository(ActiveUsersRepository)
    private readonly activeUserRepo: ActiveUsersRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CheckActiveUser],
  })
  @get(`${baseUrl}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'ActiveUser model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ActiveUsers))
    where?: Where<ActiveUsers>,
  ): Promise<Count> {
    return this.activeUserRepo.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CheckActiveUser],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of ActiveUser model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(ActiveUsers, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ActiveUsers))
    filter?: Filter<ActiveUsers>,
  ): Promise<ActiveUsers[]> {
    return this.activeUserRepo.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CheckActiveUser],
  })
  @get(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'ActiveUser model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(ActiveUsers, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(ActiveUsers))
    filter?: Filter<ActiveUsers>,
  ): Promise<ActiveUsers> {
    return this.activeUserRepo.findById(id, filter);
  }
}
