// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/context';
import {IAuthUser} from 'loopback4-authentication';
import {BINDING_PREFIX} from '../../constants';

export namespace BearerVerifierBindings {
  export const Config = BindingKey.create<BearerVerifierConfig>(
    `${BINDING_PREFIX}.bearer-verfier.config`,
  );
  /**
   * When true, a failure to read the tokensValidAfter marker lets the request
   * through instead of failing it with 503.
   */
  export const TokensValidAfterFailOpen = BindingKey.create<boolean>(
    `${BINDING_PREFIX}.bearer-verfier.tokens-valid-after-fail-open`,
  );
}

export enum BearerVerifierType {
  service,
  facade,
}
export interface BearerVerifierConfig {
  type: BearerVerifierType;
  useSymmetricEncryption?: boolean;
}

export interface IUserPrefs {
  locale?: string;
}

export interface IAuthUserWithPermissions<
  ID = string,
  TID = string,
  UTID = string,
> extends IAuthUser {
  id?: string;
  identifier?: ID;
  permissions: string[];
  authClientId: number;
  userPreferences?: IUserPrefs;
  email?: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  tenantId?: TID;
  userTenantId?: UTID;
  passwordExpiryTime?: Date;
  iat?: number;
  allowedResources?: string[];
  getIdentifier?(): string | undefined;
}
