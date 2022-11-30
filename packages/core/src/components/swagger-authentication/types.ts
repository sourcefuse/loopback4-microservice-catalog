// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 *  Exporting `HttpAuthenticationVerifier` type defination.
 *  It takes in username and password as parameters and returns a boolean.
 *  Exporting `ISwaggerAuthenticationConfig` type defination.
 */
export type HttpAuthenticationVerifier = (
  username?: string,
  password?: string,
) => boolean;

export type ISwaggerAuthenticationConfig = {};
