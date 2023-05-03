// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export type HttpAuthenticationVerifier = (
  username?: string,
  password?: string,
) => boolean;

export type ISwaggerAuthenticationConfig = {};
