// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import CryptoJS from 'crypto-js';
import {IncomingMessage, ServerResponse} from 'http';
import {AnyObject} from 'loopback-datasource-juggler';
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
  tenantContextEncryptionKey?: string;
  openapiSpec?: Record<string, unknown>;
  tenantContextMiddleware?: boolean;
  disablei18n?: boolean;

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
 * The function `addTenantId` extracts and decrypts a tenant ID from the request headers and adds it to
 * the response object.
 * @param {IncomingMessage} req - The `req` parameter is of type `IncomingMessage`, which represents an
 * incoming HTTP request.
 * @param res - The `res` parameter is used to send the response back to the client after processing the
 * request.
 * @param {AnyObject} reqResponse -  In the provided function, the 'tenant-id' property of reqResponse is being set based on the
 * 'tenant-id' header value from the incoming request.
 * @param {string} [secretKey] - The `secretKey` parameter in the `addTenantId` function is an optional
 * parameter of type `string`. It is used for decrypting the `tenant-id` value if provided. If the
 * `secretKey` is not provided, the `tenant-id` value is directly assigned to `req
 */
export function addTenantId(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  reqResponse: AnyObject,
  secretKey?: string,
) {
  if (!secretKey) {
    reqResponse['tenant-id'] = req.headers['tenant-id'];
  } else {
    const encryptedTenantId = req.headers['tenant-id'];
    const decryptedTenantId = CryptoJS.AES.decrypt(
      encryptedTenantId as string,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);
    reqResponse['tenant-id'] = decryptedTenantId;
  }
}
export type TenantIdEncryptionFn = (
  secretKey: string,
  tenantId: string,
) => Promise<string>;
