import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserInvitation,
  UserTenant,
} from '../models';
import {UserInvitationRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserInvitationUserTenantController {
  constructor(
    @repository(UserInvitationRepository)
    public userInvitationRepository: UserInvitationRepository,
  ) { }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUserInvitations, PermissionKey.ViewUserInvitationsNum],
  })
  @get('/user-invitations/{id}/user-tenant', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'UserTenant belonging to UserInvitation',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserTenant),
          },
        },
      },
    },
  })
  async getUserTenant(
    @param.path.string('id') id: typeof UserInvitation.prototype.id,
  ): Promise<UserTenant> {
    return this.userInvitationRepository.userTenant(id);
  }
}
