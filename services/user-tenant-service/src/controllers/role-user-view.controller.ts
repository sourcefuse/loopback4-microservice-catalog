import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Role,
  UserView,
} from '../models';
import {RoleRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class RoleUserViewController {
  constructor(
    @repository(RoleRepository) protected roleRepository: RoleRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewRoles, PermissionKey.ViewRolesNum],
  })
  @get('/roles/{id}/user-view', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Role has one UserView',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserView),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserView>,
  ): Promise<UserView> {
    return this.roleRepository.createdByUser(id).get(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.NotAllowed, PermissionKey.NotAllowedNum],
  })
  @post('/roles/{id}/user-view', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserView)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Role.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserView, {
            title: 'NewUserViewInRole',
            exclude: ['id'],
            optional: ['id']
          }),
        },
      },
    }) userView: Omit<UserView, 'id'>,
  ): Promise<UserView> {
    return this.roleRepository.createdByUser(id).create(userView);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.NotAllowed, PermissionKey.NotAllowedNum],
  })
  @patch('/roles/{id}/user-view', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Role.UserView PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserView, {partial: true}),
        },
      },
    })
    userView: Partial<UserView>,
    @param.query.object('where', getWhereSchemaFor(UserView)) where?: Where<UserView>,
  ): Promise<Count> {
    return this.roleRepository.createdByUser(id).patch(userView, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.NotAllowed, PermissionKey.NotAllowedNum],
  })
  @del('/roles/{id}/user-view', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Role.UserView DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserView)) where?: Where<UserView>,
  ): Promise<Count> {
    return this.roleRepository.createdByUser(id).delete(where);
  }
}
