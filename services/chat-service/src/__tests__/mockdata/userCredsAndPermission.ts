import * as jwt from 'jsonwebtoken';
import {PermissionKey} from '../../enums/permission-key.enum';
//User Creds
const User = {
  username: 'testuser@example.com',
  email: 'testuser@example.com',
  tenantId: 'T3',
};
export const testUserPayload = {
  ...User,
  role: 1,
  authClientId: 2,
  authClientIds: [2],
  deleted: false,
  userLocked: false,
  permissions: [
    PermissionKey.CreateAttachmentFile,
    PermissionKey.ViewAttachmentFile,
    PermissionKey.UpdateAttachmentFile,
    PermissionKey.DeleteAttachmentFile,
    PermissionKey.CreateMessage,
    PermissionKey.UpdateMessage,
    PermissionKey.DeleteMessage,
  ],
};
export const token = jwt.sign(testUserPayload, 'kdskssdkdfs', {
  expiresIn: 180000,
  issuer: 'sf',
});
