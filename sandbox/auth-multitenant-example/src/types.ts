// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IAuthUserWithPermissions} from '@sourceloop/core';

export interface IAuthUserWithPerms extends IAuthUserWithPermissions {
  tenantId: string;
  userTenantId?: string;
}
