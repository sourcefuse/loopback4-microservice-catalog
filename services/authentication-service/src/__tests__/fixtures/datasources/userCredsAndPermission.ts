import * as jwt from 'jsonwebtoken';
import {PermissionKey} from '../../../enums';

process.env.JWT_ISSUER = 'test';
process.env.JWT_SECRET = 'test';
//User Creds
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
export const token = jwt.sign(testUserPayload, process.env.JWT_SECRET, {
  expiresIn: 180000,
  issuer: process.env.JWT_ISSUER,
});
