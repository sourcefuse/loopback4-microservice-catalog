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
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Tenant, Group} from '../models';
import {GroupRepository, TenantRepository} from '../repositories';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey, STATUS_CODE} from '../enums';
import {
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {inject, intercept} from '@loopback/core';
import {UserGroupService} from '../services';
import {UserTenantServiceKey} from '../keys';
const baseUrl = '/tenants/{id}/groups';

@intercept(UserTenantServiceKey.TenantInterceptorInterceptor)
export class TenantGroupController {
  constructor(
    @repository(TenantRepository) protected tenantRepository: TenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
    @repository(GroupRepository)
    public groupRepository: GroupRepository,
    @inject(UserTenantServiceKey.UserGroupService)
    private readonly userGroupService: UserGroupService,
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
        description: 'Array of Tenant has many Group',
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
        description: 'Tenant model instance',
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
        description: 'Tenant.Group DELETE success count',
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
