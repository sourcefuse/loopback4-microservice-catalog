export const enum AuthenticateErrorKeys {
  UserDoesNotExist = 'UserDoesNotExist',
  UserInactive = 'UserInactive',
  TokenRevoked = 'TokenRevoked',
  TokenMissing = 'TokenMissing',
  TempPasswordLoginDisallowed = 'TempPasswordLoginDisallowed',
  PasswordInvalid = 'PasswordInvalid',
  UnprocessableData = 'UnprocessableData',
  PasswordExpiryError = 'PasswordExpiryError',
}
