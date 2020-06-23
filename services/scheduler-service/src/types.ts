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
