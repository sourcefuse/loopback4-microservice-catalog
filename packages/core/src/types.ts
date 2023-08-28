// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {IncomingMessage} from 'http';
import {AnyObject} from 'loopback-datasource-juggler';
import {SWStats} from 'swagger-stats';

export interface IServiceConfig {
  useCustomSequence: boolean;
}

export type OASPathDefinition = AnyObject;

export interface CoreConfig {
  name?: string;
  configObject?: i18n.ConfigurationOptions;
  enableObf?: boolean;
  obfPath?: string;
  openapiSpec?: Record<string, unknown>;
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
