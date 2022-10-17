// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export interface User {
  id?: string;
  username: string;
  firstName?: string;
}

export interface AuthPayload {
  clientId?: string;
  mfa?: boolean;
  userId?: string;
  user?: User;
}
