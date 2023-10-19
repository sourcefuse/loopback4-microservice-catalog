// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, intercept, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  Where,
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
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
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {
  AuthenticationBindings,
  STRATEGY,
  authenticate,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey, STATUS_CODE} from '../enums';
import {UserTenantServiceKey} from '../keys';
import {Group, Tenant} from '../models';
import {GroupRepository, TenantRepository} from '../repositories';
import {
  GroupRepository as SequelizeGroupRepository,
  TenantRepository as SequelizeTenantRepository,
} from '../repositories/sequelize';
import {UserGroupService} from '../services';
import {UserGroupService as SequelizeUserGroupService} from '../services/sequelize';
const baseUrl = '/tenants/{id}/groups';

@intercept(UserTenantServiceKey.TenantInterceptorInterceptor)
export class TenantGroupController {
  constructor(
    @repository(TenantRepository)
    protected tenantRepository: TenantRepository | SequelizeTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
    @repository(GroupRepository)
    public groupRepository: GroupRepository | SequelizeGroupRepository,
    @service(UserGroupService)
    protected readonly userGroupService:
      | UserGroupService
      | SequelizeUserGroupService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewGroupList],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Groups of Tenant',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Group)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Group>,
  ): Promise<Group[]> {
    return this.groupRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateGroup, PermissionKey.CreateGroupNum],
  })
  @post(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Group model instance',
        content: {'application/json': {schema: getModelSchemaRef(Group)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Tenant.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Group, {
            title: 'NewGroupInTenant',
            exclude: ['id', 'tenantId'],
          }),
        },
      },
    })
    group: Omit<Group, 'id'>,
  ): Promise<Group> {
    const groupInDb = await this.groupRepository.findOne({
      where: {
        name: group.name,
      },
    });
    if (groupInDb) {
      throw new HttpErrors.Forbidden(' Group with same name already exist');
    }
    group.tenantId = id ?? '';
    const createdGroup = await this.groupRepository.create(group);
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
    permissions: [PermissionKey.UpdateGroup, PermissionKey.UpdateGroupNum],
  })
  @patch(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Tenant.Group PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Group, {partial: true}),
        },
      },
    })
    group: Partial<Group>,
    @param.query.object('where', getWhereSchemaFor(Group)) where?: Where<Group>,
  ): Promise<Count> {
    return this.groupRepository.updateAll(group, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteGroup, PermissionKey.DeleteGroupNum],
  })
  @del(`${baseUrl}/{groupId}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Tenant.Group DELETE',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.path.string('groupId') groupId: string,
    @param.query.object('where', getWhereSchemaFor(Group)) where?: Where<Group>,
  ): Promise<void> {
    await this.userGroupService.deleteAllBygroupIds([groupId]);
    await this.groupRepository.deleteById(groupId);
  }
}
