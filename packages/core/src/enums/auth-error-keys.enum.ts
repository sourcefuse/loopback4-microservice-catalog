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
  InvalidKey = 'InvalidKey',
  InvalidOtp = 'InvalidOtp',
}
