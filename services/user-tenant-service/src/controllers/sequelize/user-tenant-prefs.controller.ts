// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';

import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

import {UserTenantPrefsRepository} from '../../repositories/sequelize';
import {UserTenantPrefsController as JugglerUserTenantPrefsController} from '../user-tenant-prefs.controller';

export class UserTenantPrefsController extends JugglerUserTenantPrefsController {
  constructor(
    @repository(UserTenantPrefsRepository)
    public userTenantPrefsRepository: UserTenantPrefsRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected readonly currentUser: IAuthUserWithPermissions,
  ) {
    super(userTenantPrefsRepository, currentUser);
  }
}
