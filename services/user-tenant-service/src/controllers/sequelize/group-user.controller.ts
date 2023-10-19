// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject, intercept, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request, RestBindings} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserTenantServiceKey} from '../../keys';
import {
  GroupRepository,
  UserTenantRepository,
} from '../../repositories/sequelize';
import {UserGroupService} from '../../services/sequelize';
import {GroupUserController as JugglerGroupUserController} from '../group-user.controller';

@intercept(UserTenantServiceKey.GroupTenantInterceptor)
export class GroupUserController extends JugglerGroupUserController {
  constructor(
    @repository(GroupRepository) protected groupRepository: GroupRepository,
    @repository(UserTenantRepository)
    protected userTenantRepository: UserTenantRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
    @service(UserGroupService)
    protected readonly userGroupService: UserGroupService,
    @inject.getter(RestBindings.Http.REQUEST)
    protected readonly getRequest: Getter<Request>,
  ) {
    super(
      groupRepository,
      userTenantRepository,
      currentUser,
      userGroupService,
      getRequest,
    );
  }
}
