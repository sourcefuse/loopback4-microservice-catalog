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
  UserTenant,
  UserInvitation,
} from '../models';
import {UserTenantRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserTenantUserInvitationController {
  constructor(
    @repository(UserTenantRepository) protected userTenantRepository: UserTenantRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserTenant,
    ],
  })
  @get('/user-tenants/{id}/user-invitations', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of UserTenant has many UserInvitation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserInvitation)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserInvitation>,
  ): Promise<UserInvitation[]> {
    return this.userTenantRepository.userInvitations(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateUserTenant,PermissionKey.CreateUserInvitation
    ],
  })
  @post('/user-tenants/{id}/user-invitations', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserInvitation)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof UserTenant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserInvitation, {
            title: 'NewUserInvitationInUserTenant',
            exclude: ['id'],
            optional: ['userTenantId']
          }),
        },
      },
    }) userInvitation: Omit<UserInvitation, 'id'>,
  ): Promise<UserInvitation> {
    return this.userTenantRepository.userInvitations(id).create(userInvitation);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenant,PermissionKey.UpdateUserInvitation
    ],
  })
  @patch('/user-tenants/{id}/user-invitations', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant.UserInvitation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserInvitation, {partial: true}),
        },
      },
    })
    userInvitation: Partial<UserInvitation>,
    @param.query.object('where', getWhereSchemaFor(UserInvitation)) where?: Where<UserInvitation>,
  ): Promise<Count> {
    return this.userTenantRepository.userInvitations(id).patch(userInvitation, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteUserTenant
    ],
  })
  @del('/user-tenants/{id}/user-invitations', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant.UserInvitation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserInvitation)) where?: Where<UserInvitation>,
  ): Promise<Count> {
    return this.userTenantRepository.userInvitations(id).delete(where);
  }
}
