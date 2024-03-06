// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {HttpErrors} from '@loopback/rest';
// eslint-disable-next-line @typescript-eslint/naming-convention
import CryptoJS from 'crypto-js';
import {IncomingMessage, ServerResponse} from 'http';
import {AnyObject} from 'loopback-datasource-juggler';
import {AuthErrorKeys} from 'loopback4-authentication';
import {SWStats} from 'swagger-stats';
export interface IServiceConfig {
  useCustomSequence: boolean;
  useSequelize?: boolean;
}

export type OASPathDefinition = AnyObject;

export interface CoreConfig {
  name?: string;
  configObject?: i18n.ConfigurationOptions;
  enableObf?: boolean;
  obfPath?: string;
  openapiSpec?: Record<string, unknown>;
  addTenantIdmiddleware?: boolean;
  /**
   * In order to hide or alter some path from the definition provided by swagger stats, `modifyPathDefinition`
   * callback can be used. It'll get called for each of the path specified in the `openapiSpec` provided.
   * @param path The name of the API path.
   * @param pathDefinition The definition object containing method and other details.
   * @returns `null` if the path needs to be omitted from the spec else return the `pathDefinition` either in the original form as received in the argument or by modifying it as per the needs.
   */
  modifyPathDefinition?: (
    path: string,
    pathDefinition: OASPathDefinition,
  ) => OASPathDefinition | null;

  authentication?: boolean;
  swaggerUsername?: string;
  swaggerPassword?: string;
  authenticateSwaggerUI?: boolean;

  swaggerStatsConfig?: Omit<
    SWStats,
    'name' | 'uriPath' | 'swaggerSpec' | 'authentication' | 'onAuthenticate'
  >;

  swaggerAuthenticate?: (
    req?: IncomingMessage,
    username?: string,
    password?: string,
  ) => boolean;
}
/**
 * The function `addTenantId` adds the `tenantId` from the request headers to the `reqResponse` object.
 * @param {IncomingMessage} req - The `req` parameter is an object representing the incoming HTTP
 * request.
 * @param res - The `res` parameter in the `addTenantId` function is of type
 * `ServerResponse<IncomingMessage>`.
 * @param {AnyObject} reqResponse - In the provided function `addTenantId`, the function is
 * adding a `tenantId` property to the `reqResponse` object based on the value of the `tenant-id`
 * header
 */
export function addTenantId(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  reqResponse: AnyObject,
) {
  if (!process.env.TENANT_SECRET_KEY) {
    throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
  }
  const encryptedTenantId = req.headers['tenant-id'];
  const secretKey = process.env.TENANT_SECRET_KEY as string;
  const decryptedTenantId = CryptoJS.AES.decrypt(
    encryptedTenantId as string,
    secretKey,
  ).toString(CryptoJS.enc.Utf8);
  reqResponse['tenant-id'] = decryptedTenantId;
}
