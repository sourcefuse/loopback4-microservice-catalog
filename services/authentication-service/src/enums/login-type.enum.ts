// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export const enum LoginType {
  ACCESS = 'ACCESS',
  RELOGIN = 'RELOGIN',
  LOGOUT = 'LOGOUT',
}

export const enum ActiveUsersRange {
  DAILY = 'daily',
  MONTHLY = 'monthly',
}

export const enum UserIdentity {
  ACTOR_ID = 'actorId',
  USER_NAME = 'userName',
}
