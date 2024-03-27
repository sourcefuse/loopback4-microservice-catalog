// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, injectable} from '@loopback/core';
import {
  DataObject,
  HasOneRepositoryFactory,
  Options,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {User, UserCredentials} from '../models';
import {UserRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class UserHelperService {
  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async create(entity: DataObject<User>, options?: Options): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: {username: entity.username},
    });
    if (userExists) {
      throw new HttpErrors.BadRequest('User already exists');
    }
    const user = await this.userRepository.create(entity, options);
    try {
      let creds: UserCredentials;
      if (options?.authProvider) {
        switch (options.authProvider) {
          case 'internal': {
            creds = new UserCredentials({
              authProvider: 'internal',
            });
            break;
          }
          case 'keycloak':
          default: {
            creds = new UserCredentials({
              authProvider: 'keycloak',
              authId: options?.authId,
            });
            break;
          }
        }
      } else {
        creds = new UserCredentials({
          authProvider: 'keycloak',
          authId: options?.authId,
        });
      }
      await this.credentials(user.id).create(creds, options);
    } catch (err) {
      await this.userRepository.deleteByIdHard(user.id);
      throw new HttpErrors.UnprocessableEntity('Error while hashing password');
    }
    return user;
  }
}
