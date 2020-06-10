import { IAuthUserWithPermissions } from '@sourcefuse-service-catalog/core';

export interface CustomPermissionFn {
    (user: IAuthUserWithPermissions): Promise<boolean>;
  }

export interface ISchedulerConfig {
  jwtIssuer: string;
  jwtSecret: string;
}