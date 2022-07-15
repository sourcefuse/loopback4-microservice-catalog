// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {IdentifierType} from './models/enums/identifier-type.enum';

export interface CustomPermissionFn {
  (user: IAuthUserWithPermissions): Promise<boolean>;
}

export interface ISchedulerConfig {
  jwtIssuer: string;
  jwtSecret: string;
  identifierMappedTo: IdentifierType;
}
