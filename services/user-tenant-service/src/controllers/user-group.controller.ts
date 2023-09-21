import {
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
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserGroup} from '../models';
import {UserGroupRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserGroupController {
  constructor(
    @repository(UserGroupRepository)
    public userGroupRepository : UserGroupRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateUserGroup,
      PermissionKey.CreateUserGroupNum,
    ],
  })
  @post('/user-groups',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserGroup model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserGroup)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserGroup, {
            title: 'NewUserGroup',
            exclude: ['id'],
          }),
        },
      },
    })
    userGroup: Omit<UserGroup, 'id'>,
  ): Promise<UserGroup> {
    return this.userGroupRepository.create(userGroup);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserGroupList,
      PermissionKey.ViewUserGroupListNum,
    ],
  })
  @get('/user-groups/count',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserGroup model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserGroup) where?: Where<UserGroup>,
  ): Promise<Count> {
    return this.userGroupRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserGroupList,
      PermissionKey.ViewUserGroupListNum,
    ],
  })
  @get('/user-groups',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Array of UserGroup model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserGroup, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserGroup) filter?: Filter<UserGroup>,
  ): Promise<UserGroup[]> {
    return this.userGroupRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserGroup,
      PermissionKey.UpdateUserGroupNum,
    ],
  })
  @patch('/user-groups',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserGroup PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserGroup, {partial: true}),
        },
      },
    })
    userGroup: UserGroup,
    @param.where(UserGroup) where?: Where<UserGroup>,
  ): Promise<Count> {
    return this.userGroupRepository.updateAll(userGroup, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserGroupList,
      PermissionKey.ViewUserGroupList,
    ],
  })
  @get('/user-groups/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserGroup model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserGroup, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserGroup, {exclude: 'where'}) filter?: FilterExcludingWhere<UserGroup>
  ): Promise<UserGroup> {
    return this.userGroupRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserGroup,
      PermissionKey.UpdateUserGroupNum,
    ],
  })
  @patch('/user-groups/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserGroup PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserGroup, {partial: true}),
        },
      },
    })
    userGroup: UserGroup,
  ): Promise<void> {
    await this.userGroupRepository.updateById(id, userGroup);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserGroup,
      PermissionKey.UpdateUserGroupNum,
    ],
  })
  @put('/user-groups/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserGroup PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userGroup: UserGroup,
  ): Promise<void> {
    await this.userGroupRepository.replaceById(id, userGroup);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteUserGroup,
      PermissionKey.DeleteUserGroupNum,
    ],
  })
  @del('/user-groups/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserGroup DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userGroupRepository.deleteById(id);
  }
}
