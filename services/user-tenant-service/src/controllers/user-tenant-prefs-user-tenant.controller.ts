import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserTenantPrefs,
  UserTenant,
} from '../models';
import {UserTenantPrefsRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserTenantPrefsUserTenantController {
  constructor(
    @repository(UserTenantPrefsRepository)
    public userTenantPrefsRepository: UserTenantPrefsRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUserTenantPreference, PermissionKey.ViewUserTenantPreferenceNum],
  })
  @get('/user-tenant-prefs/{id}/user-tenant', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant belonging to UserTenantPrefs',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserTenant),
          },
        },
      },
    },
  })
  async getUserTenant(
    @param.path.string('id') id: typeof UserTenantPrefs.prototype.id,
  ): Promise<UserTenant> {
    return this.userTenantPrefsRepository.userTenant(id);
  }
}
