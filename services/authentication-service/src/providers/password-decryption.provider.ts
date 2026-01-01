import {Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys} from 'loopback4-authentication';
import forge from 'node-forge';
import {PasswordDecryptionFn} from './types';
export class PasswordDecryptionProvider implements Provider<PasswordDecryptionFn> {
  value(): PasswordDecryptionFn {
    return async (password: string) => {
      if (!process.env.PRIVATE_DECRYPTION_KEY) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      const privateKey = forge.pki.privateKeyFromPem(
        process.env.PRIVATE_DECRYPTION_KEY,
      );
      const decryptedPassword = privateKey.decrypt(password);
      return decryptedPassword;
    };
  }
}
