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
import {AuthenticateErrorKeys} from '@sourceloop/core';
import * as bcrypt from 'bcrypt';
import {AuthErrorKeys} from 'loopback4-authentication';
import {User, UserCredentials} from '../models';
import {UserExtRepository} from '../repositories';

const saltRounds = 10;

@injectable({scope: BindingScope.TRANSIENT})
export class UserExtHelperService {
  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  constructor(
    @repository(UserExtRepository)
    public userExtRepository: UserExtRepository,
  ) {}

  async create(entity: DataObject<User>, options?: Options): Promise<User> {
    const userExists = await this.userExtRepository.findOne({
      where: {username: entity.username},
    });
    if (userExists) {
      throw new HttpErrors.BadRequest('User already exists');
    }
    const user = await this.userExtRepository.create(entity, options);
    try {
      let creds: UserCredentials;
      if (options?.authProvider) {
        switch (options.authProvider) {
          case 'keycloak': {
            creds = new UserCredentials({
              authProvider: 'keycloak',
              authId: options?.authId,
            });
            break;
          }
          case 'internal':
          default: {
            const password = await bcrypt.hash(
              process.env.USER_TEMP_PASSWORD as string,
              saltRounds,
            );
            creds = new UserCredentials({
              authProvider: 'internal',
              password,
            });
            break;
          }
        }
      } else {
        const password = await bcrypt.hash(
          process.env.USER_TEMP_PASSWORD as string,
          saltRounds,
        );
        creds = new UserCredentials({
          authProvider: 'internal',
          password,
        });
      }
      await this.credentials(user.id).create(creds, options);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.userExtRepository.deleteByIdHard(user.id);
      throw new HttpErrors.UnprocessableEntity('Error while hashing password');
    }
    return user;
  }

  async verifyPassword(username: string, password: string): Promise<User> {
    const user = await this.userExtRepository.findOne({where: {username}});
    const creds = user && (await this.credentials(user.id).get());
    if ((!user || user.deleted) ?? !creds?.password) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (!(await bcrypt.compare(password, creds.password))) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    } else if (
      process.env.USER_TEMP_PASSWORD &&
      (await bcrypt.compare(password, process.env.USER_TEMP_PASSWORD))
    ) {
      throw new HttpErrors.Forbidden(
        AuthenticateErrorKeys.TempPasswordLoginDisallowed,
      );
    } else {
      return user;
    }
  }

  async updatePassword(
    username: string,
    password: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userExtRepository.findOne({where: {username}});
    const creds = user && (await this.credentials(user.id).get());
    if ((!user || user.deleted) ?? !creds?.password) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (!(await bcrypt.compare(password, creds.password))) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.WrongPassword);
    } else if (await bcrypt.compare(newPassword, creds.password)) {
      throw new HttpErrors.Unauthorized(
        'Password cannot be same as previous password!',
      );
    } else {
      // Do nothing
    }
    await this.credentials(user.id).patch({
      password: await bcrypt.hash(newPassword, saltRounds),
    });
    return user;
  }
}
