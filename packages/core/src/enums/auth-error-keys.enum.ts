// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export const enum AuthenticateErrorKeys {
  UserDoesNotExist = 'UserDoesNotExist',
  PasswordCannotBeChanged = 'PasswordCannotBeChangedForExternalUser',
  UserInactive = 'UserInactive',
  TokenRevoked = 'TokenRevoked',
  TokenMissing = 'TokenMissing',
  TempPasswordLoginDisallowed = 'TempPasswordLoginDisallowed',
  PasswordInvalid = 'PasswordInvalid',
  UnprocessableData = 'UnprocessableData',
  PasswordExpiryError = 'PasswordExpiryError',
}
