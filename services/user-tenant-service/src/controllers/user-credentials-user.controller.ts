import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  UserCredentials,
  User,
} from '../models';
import {UserCredentialsRepository, UserViewRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserCredentialsUserController {
  constructor(
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository(UserViewRepository)
    public userViewRepository: UserViewRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUserCredential, PermissionKey.ViewUserCredentialNum],
  })
  @get('/user-credentials/{id}/user', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User belonging to UserCredentials',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof UserCredentials.prototype.id,
  ): Promise<User> {
    return this.userCredentialsRepository.user(id);
  }
}
