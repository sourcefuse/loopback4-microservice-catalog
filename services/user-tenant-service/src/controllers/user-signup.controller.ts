// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {PermissionKey, AuthProvider} from '../enums';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {CONTENT_TYPE, ErrorCodes, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {UserSignupCheckDto} from '../models';
import {UserCredentialsRepository, UserRepository} from '../repositories';
export const USER_SIGN_UP_RESPONSE_DESCRIPTION = 'Success Response.';

export class UserSignupController {
  constructor(
    @repository(UserCredentialsRepository)
    public userCredsRepository: UserCredentialsRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewAnyUser,
      PermissionKey.ViewTenantUser,
      PermissionKey.ViewAnyUserNum,
      PermissionKey.ViewTenantUserNum,
    ],
  })
  @get('/check-signup/{email}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: USER_SIGN_UP_RESPONSE_DESCRIPTION,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(UserSignupCheckDto),
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async checkUserSignup(
    @param.path.string('email') email: string,
  ): Promise<UserSignupCheckDto> {
    let isSignedUp = false;
    const user = await this.userRepository.findOne({
      where: {email},
    });
    if (user) {
      const userCreds = await this.userCredsRepository.findOne({
        where: {
          userId: user.id,
        },
      });
      if (userCreds?.authProvider === AuthProvider.Internal) {
        isSignedUp = !!userCreds?.password?.length;
      } else {
        isSignedUp = true;
      }
    }
    return new UserSignupCheckDto({
      isSignedUp,
    });
  }
}
