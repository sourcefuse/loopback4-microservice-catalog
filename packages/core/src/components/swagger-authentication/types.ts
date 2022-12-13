// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 *  Exporting `HttpAuthenticationVerifier` type defination.
 *  It takes username and password as parameters and returns a boolean.
 *  Exporting `ISwaggerAuthenticationConfig` type defination.
 */
export type HttpAuthenticationVerifier = (
  username?: string,
  password?: string,
) => boolean;

/**
 * `ISwaggerAuthenticationConfig` is an empty object.
 */
export type ISwaggerAuthenticationConfig = {};
