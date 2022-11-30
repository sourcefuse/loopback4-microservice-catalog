// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IAuthUser} from 'loopback4-authentication';
import {BindingKey} from '@loopback/context';
import {BINDING_PREFIX} from '../../constants';

/* Creating a namespace called 'BearerVerifierBindings' and then creating a constant called Config. */
export namespace BearerVerifierBindings {
  export const Config = BindingKey.create<BearerVerifierConfig>(
    `${BINDING_PREFIX}.bearer-verfier.config`,
  );
}

/* Defining the type of the config object that is passed to the 'BearerVerifierBindings.Config.' */
export enum BearerVerifierType {
  service,
  facade,
}
export interface BearerVerifierConfig {
  type: BearerVerifierType;
}

/* Defining an interface 'IUserPrefs' for the user preferences. */
export interface IUserPrefs {
  locale?: string;
}

/**
 *  Exporting interface `IAuthUserWithPermissions`.
 *  Extending the 'IAuthUser' interface and adding more properties to it. */
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
