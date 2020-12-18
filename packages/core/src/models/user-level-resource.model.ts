import {UserModifiableEntity} from './user-modifiable-entity.model';
import {IUserResource} from 'loopback4-authorization';

export class UserLevelResource
  extends UserModifiableEntity
  implements IUserResource<string> {
  id?: string;

  userTenantId: string;

  resourceName: string;

  resourceValue: string;

  allowed: boolean;

  constructor(data?: Partial<UserLevelResource>) {
    super(data);
  }
}
