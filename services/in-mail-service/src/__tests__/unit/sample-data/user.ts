// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IAuthUserWithPermissions} from '@sourceloop/core';

export const user: IAuthUserWithPermissions = {
  id: 'random-id',
  firstName: 'random',
  lastName: 'user',
  tenantId: '1234-5678',
  username: 'random',
  email: 'random@random',
  permissions: [],
  authClientId: 1,
  role: 'random',
};
