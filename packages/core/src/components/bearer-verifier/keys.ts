// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IAuthUser} from 'loopback4-authentication';
import {BindingKey} from '@loopback/context';
import {BINDING_PREFIX} from '../../constants';

/**
 * @param {BearerVerifierBindings} - Creating a namespace called 'BearerVerifierBindings' and
 * then creating a constant called Config.
 * @param {BearerVerifierType} - `BearerVerifierType` a type of the config object that is passed to the 'BearerVerifierBindings.Config.'
 * @param {IUserPrefs} - exporting an interface `IUserPrefs` for the user preference.
 *  */
export namespace BearerVerifierBindings {
  export const Config = BindingKey.create<BearerVerifierConfig>(
    `${BINDING_PREFIX}.bearer-verfier.config`,
  );
}

export enum BearerVerifierType {
  service,
  facade,
}
export interface BearerVerifierConfig {
  type: BearerVerifierType;
}

export interface IUserPrefs {
  locale?: string;
}

/**
 *  @param {IAuthUserWithPermissions} - exporting interface `IAuthUserWithPermissions`.
 *  @param {IAuthUser} - extending the 'IAuthUser' interface and adding more properties to it.
 *  @return Properties in their data types will give value in return.
 * */
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
  allowedResources?: string[];
  getIdentifier?(): string | undefined;
}
