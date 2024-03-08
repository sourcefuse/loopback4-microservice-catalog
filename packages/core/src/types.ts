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
 * The function `addTenantId` decrypts a tenant ID from the request headers using a secret key and adds
 * it to the response object.
 * The function `addTenantId` adds the `tenantId` from the request headers to the `reqResponse` object.
 * @param {IncomingMessage} req - The `req` parameter is an object representing the incoming HTTP
 * request.
 * @param res - The `res` parameter in the `addTenantId` function is of type
 * `ServerResponse<IncomingMessage>`.
 * @param {AnyObject} reqResponse - The `reqResponse` parameter in the `addTenantId` function is an
 * object that will be modified to include the decrypted tenant ID. The function extracts the encrypted
 * tenant ID from the `tenant-id` header in the incoming request, decrypts it using the
 * `TENANT_SECRET_KEY` environment
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
