// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {IdentifierType} from './models/enums/identifier-type.enum';

export type CustomPermissionFn = (
  user: IAuthUserWithPermissions,
) => Promise<boolean>;

export interface ISchedulerConfig {
  jwtIssuer: string;
  jwtSecret: string;
  identifierMappedTo: IdentifierType;
}
