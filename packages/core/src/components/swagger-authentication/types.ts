// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 *  @param {HttpAuthenticationVerifier} - exporting `HttpAuthenticationVerifier` type defination.
 *  @return It takes username and password as parameters and returns a boolean.
 *  @param {ISwaggerAuthenticationConfig} - exporting `ISwaggerAuthenticationConfig` type defination.
 */
export type HttpAuthenticationVerifier = (
  username?: string,
  password?: string,
) => boolean;

export type ISwaggerAuthenticationConfig = {};
