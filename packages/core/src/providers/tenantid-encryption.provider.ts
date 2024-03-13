import {Provider} from '@loopback/core';
// eslint-disable-next-line @typescript-eslint/naming-convention
import CryptoJS from 'crypto-js';
import {TenantIdEncryptionFn} from '../types';
export class TenantIdEncryptionProvider
  implements Provider<TenantIdEncryptionFn>
{
  value(): TenantIdEncryptionFn {
    return async (secretKey: string, tenantId: string) => {
      const encryptedTenantId = CryptoJS.AES.encrypt(
        tenantId,
        secretKey,
      ).toString();
      return encryptedTenantId;
    };
  }
}
