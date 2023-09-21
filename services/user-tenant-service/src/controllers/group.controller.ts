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
import {Group} from '../models';
import {GroupRepository} from '../repositories';
import { IAuthUserWithPermissions, OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, AuthenticationBindings, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';
import { inject } from '@loopback/core';
import { UserGroupService } from '../services/user-group.service';

export class GroupController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
    @repository(GroupRepository)
    public groupRepository : GroupRepository,
    @inject('services.UserGroupService')
    private readonly userGroupService: UserGroupService
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
  @post('/groups',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Group model instance',
    content: {'application/json': {schema: getModelSchemaRef(Group)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Group, {
            title: 'NewGroup',
            exclude: ['id'],
          }),
        },
      },
    })
    group: Omit<Group, 'id'>,
  ): Promise<Group> {
    const createdGroup=await this.groupRepository.create(group);
    const groupOwner = {
      groupId: `${createdGroup.id}`,
      userTenantId: this.currentUser.userTenantId,
    };
    await this.userGroupService.create(groupOwner);
    return createdGroup;
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
  @get('/groups/count',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Group model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Group) where?: Where<Group>,
  ): Promise<Count> {
    return this.groupRepository.count(where);
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
  @get('/groups',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Array of Group model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Group, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Group) filter?: Filter<Group>,
  ): Promise<Group[]> {
    return this.groupRepository.find(filter);
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
  @patch('/groups',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Group PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Group, {partial: true}),
        },
      },
    })
    group: Group,
    @param.where(Group) where?: Where<Group>,
  ): Promise<Count> {
    return this.groupRepository.updateAll(group, where);
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
  @get('/groups/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Group model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Group, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Group, {exclude: 'where'}) filter?: FilterExcludingWhere<Group>
  ): Promise<Group> {
    return this.groupRepository.findById(id, filter);
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
  @patch('/groups/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'Group PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Group, {partial: true}),
        },
      },
    })
    group: Group,
  ): Promise<void> {
    await this.groupRepository.updateById(id, group);
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
  @put('/groups/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'Group PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() group: Group,
  ): Promise<void> {
    await this.groupRepository.replaceById(id, group);
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
  @del('/groups/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'Group DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userGroupService.deleteAllBygroupIds([id])
    await this.groupRepository.deleteById(id);
  }
}
