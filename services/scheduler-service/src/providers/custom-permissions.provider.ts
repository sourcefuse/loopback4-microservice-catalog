import {Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {CustomPermissionFn} from '../types';

/**
 * A provider for custom permissions
 *
 * It will just throw an error saying Not Implemented
 */
export class CustomPermissionsProvider implements Provider<CustomPermissionFn> {
  constructor() {}

  value(): CustomPermissionFn {
    return async user => {
      throw new HttpErrors.NotImplemented(
        `CustomPermissionFn is not implemented`,
      );
    };
  }
}
