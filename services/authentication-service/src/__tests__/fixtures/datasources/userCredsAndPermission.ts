import * as fs from 'fs';
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
  static createToken() {
    const privateKey = fs.readFileSync(
      process.env.JWT_PRIVATE_KEY ?? '',
    ) as Buffer;

    return jwt.sign(testUserPayload, privateKey, {
      expiresIn: 180000,
      issuer: 'test',
      algorithm: 'RS256',
    });
  }
}
