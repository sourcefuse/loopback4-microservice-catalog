import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  UserGroup,
} from '../models';
import {UserTenantRepository} from '../repositories';
import { IAuthUserWithPermissions, OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, AuthenticationBindings, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey, STATUS_CODE } from '../enums';
import { inject, intercept } from '@loopback/core';
import { UserTenantServiceKey } from '../keys';

const baseUrl='/user-tenants/{id}/user-groups';

@intercept(UserTenantServiceKey.UserTenantInterceptorInterceptor)
export class UserTenantUserGroupController {
  constructor(
    @repository(UserTenantRepository) protected userTenantRepository: UserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
  ) { }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserTenant,
    ],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of UserTenant has many UserGroup',
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
    return this.userTenantRepository.userGroups(id).find(filter);
  }

}
