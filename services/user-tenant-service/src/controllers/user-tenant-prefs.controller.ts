// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {PermissionKey} from '../enums';
import {inject} from '@loopback/context';
import {Filter, repository} from '@loopback/repository';
import {
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  STATUS_CODE,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {UserTenantPrefs} from '../models';
import {UserTenantPrefsRepository} from '../repositories/user-tenant-prefs.repository';

const basePath = '/user-tenant-prefs';

export class UserTenantPrefsController {
  constructor(
    @repository(UserTenantPrefsRepository)
    public userTenantPrefsRepository: UserTenantPrefsRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenantPreference,
      PermissionKey.UpdateUserTenantPreferenceNum,
    ],
  })
  @post(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'UserTenantPrefs model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(UserTenantPrefs)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(UserTenantPrefs, {
            title: 'NewUserTenantPrefs',
            exclude: ['id'],
          }),
        },
      },
    })
    userTenantPrefs: Omit<UserTenantPrefs, 'id'>,
  ): Promise<void> {
    if (this.currentUser.userTenantId) {
      userTenantPrefs.userTenantId = this.currentUser.userTenantId;
    }
    const prefExists = await this.userTenantPrefsRepository.findOne({
      where: {
        userTenantId: userTenantPrefs.userTenantId,
        configKey: userTenantPrefs.configKey,
      },
    });
    if (!prefExists) {
      await this.userTenantPrefsRepository.create(userTenantPrefs);
    } else {
      await this.userTenantPrefsRepository.updateById(prefExists.id, {
        configValue: userTenantPrefs.configValue,
      });
    }
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.ViewUserTenantPreference,
      PermissionKey.ViewUserTenantPreferenceNum,
    ],
  })
  @get(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of UserTenantPrefs model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserTenantPrefs, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(UserTenantPrefs))
    filter?: Filter<UserTenantPrefs>,
  ): Promise<UserTenantPrefs[]> {
    if (!filter) {
      filter = {where: {}};
    }
    filter.where = {
      and: [filter.where ?? {}, {userTenantId: this.currentUser.userTenantId}],
    };
    return this.userTenantPrefsRepository.find(filter);
  }
}
