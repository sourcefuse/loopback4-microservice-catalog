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
  Group,
  UserGroup,
} from '../models';
import {GroupRepository} from '../repositories';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';

export class GroupUserGroupController {
  constructor(
    @repository(GroupRepository) protected groupRepository: GroupRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserGroupList,
      PermissionKey.ViewUserGroupListNum,
    ],
  })
  @get('/groups/{id}/user-groups', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Group has many UserGroup',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserGroup)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserGroup>,
  ): Promise<UserGroup[]> {
    return this.groupRepository.userGroups(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.CreateUserGroup,
      PermissionKey.CreateUserGroupNum,
    ],
  })
  @post('/groups/{id}/user-groups', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Group model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserGroup)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Group.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserGroup, {
            title: 'NewUserGroupInGroup',
            exclude: ['id'],
            optional: ['groupId']
          }),
        },
      },
    }) userGroup: Omit<UserGroup, 'id'>,
  ): Promise<UserGroup> {
    return this.groupRepository.userGroups(id).create(userGroup);
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
  @patch('/groups/{id}/user-groups', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Group.UserGroup PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserGroup, {partial: true}),
        },
      },
    })
    userGroup: Partial<UserGroup>,
    @param.query.object('where', getWhereSchemaFor(UserGroup)) where?: Where<UserGroup>,
  ): Promise<Count> {
    return this.groupRepository.userGroups(id).patch(userGroup, where);
  }

  @del('/groups/{id}/user-groups', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Group.UserGroup DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserGroup)) where?: Where<UserGroup>,
  ): Promise<Count> {
    return this.groupRepository.userGroups(id).delete(where);
  }
}
