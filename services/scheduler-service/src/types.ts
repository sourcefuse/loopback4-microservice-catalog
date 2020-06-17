import {IAuthUserWithPermissions} from '@sourceloop/core';

export interface CustomPermissionFn {
  (user: IAuthUserWithPermissions): Promise<boolean>;
}

export interface ISchedulerConfig {
  jwtIssuer: string;
  jwtSecret: string;
  identifierMappedTo: string;
}
