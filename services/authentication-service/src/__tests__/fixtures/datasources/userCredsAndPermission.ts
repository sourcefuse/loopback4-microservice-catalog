import {JwtKeysRepository} from '@sourceloop/core';
import * as jwt from 'jsonwebtoken';
import {PermissionKey} from '../../../enums';

process.env.JWT_ISSUER = 'test';
const User = {
  id: 1,
  username: 'test_user',
  password: 'test_password',
  tenantId: 'tenant1',
};
export const testUserPayload = {
  ...User,
  role: 1,
  authClientId: 2,
  authClientIds: [2],
  deleted: false,
  userLocked: false,
  permissions: [PermissionKey.ViewLoginActivity],
};
export class JwtToken {
  static async createToken(jwtKeysRepo: JwtKeysRepository) {
    const keys = await jwtKeysRepo.find();

    if (!keys) {
      throw new Error('No keys found');
    }

    const token = jwt.sign(
      testUserPayload,
      {
        key: keys[0].privateKey,
        passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
      },
      {
        algorithm: 'RS256',
        issuer: process.env.JWT_ISSUER,
        keyid: keys[0].keyId,
      },
    );
    return token;
  }
}
