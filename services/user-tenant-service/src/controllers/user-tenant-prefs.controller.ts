// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize, AuthorizeErrorKeys} from 'loopback4-authorization';
import {PermissionKey, STATUS_CODE} from '../enums';
import {UserTenantPrefs} from '../models';
import {UserTenantPrefsRepository} from '../repositories';

const baseUrl = '/user-tenant-prefs';

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
      PermissionKey.CreateUserTenantPreference,
      PermissionKey.CreateUserTenantPreferenceNum,
    ],
  })
  @post(baseUrl, {security: OPERATION_SECURITY_SPEC, responses: {}})
  @response(STATUS_CODE.OK, {
    description: 'UserTenantPrefs model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserTenantPrefs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenantPrefs, {
            title: 'NewUserTenantPrefs',
            exclude: ['id', 'userTenantId'],
          }),
        },
      },
    })
    userTenantPrefs: Omit<UserTenantPrefs, 'id'>,
  ): Promise<UserTenantPrefs> {
    if (this.currentUser.userTenantId) {
      userTenantPrefs.userTenantId = this.currentUser.userTenantId;
    }
    const prefExists = await this.userTenantPrefsRepository.findOne({
      where: {
        userTenantId: userTenantPrefs.userTenantId,
        configKey: userTenantPrefs.configKey,
      },
    });
    if (prefExists) {
      await this.userTenantPrefsRepository.updateById(prefExists.id, {
        configValue: userTenantPrefs.configValue,
      });
      return userTenantPrefs;
    }
    return this.userTenantPrefsRepository.create(userTenantPrefs);
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
  @get(`${baseUrl}/count`, {security: OPERATION_SECURITY_SPEC, responses: {}})
  @response(STATUS_CODE.OK, {
    description: 'UserTenantPrefs model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserTenantPrefs) where?: Where<UserTenantPrefs>,
  ): Promise<Count> {
    if (!where) {
      where = {};
    }
    where = {
      and: [where ?? {}, {userTenantId: this.currentUser.userTenantId}],
    };
    return this.userTenantPrefsRepository.count(where);
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
  @get(baseUrl, {security: OPERATION_SECURITY_SPEC, responses: {}})
  @response(STATUS_CODE.OK, {
    description: 'Array of UserTenantPrefs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserTenantPrefs, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserTenantPrefs) filter?: Filter<UserTenantPrefs>,
  ): Promise<UserTenantPrefs[]> {
    if (!filter) {
      filter = {where: {}};
    }
    filter.where = {
      and: [filter.where ?? {}, {userTenantId: this.currentUser.userTenantId}],
    };
    return this.userTenantPrefsRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteUserTenantPreference,
      PermissionKey.DeleteUserTenantPreferenceNum,
    ],
  })
  @del(`${baseUrl}/{id}`, {security: OPERATION_SECURITY_SPEC, responses: {}})
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'UserTenantPrefs DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const userTenantPrefs = await this.userTenantPrefsRepository.findById(id);
    if (userTenantPrefs.userTenantId !== this.currentUser.userTenantId) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return this.userTenantPrefsRepository.deleteById(id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.DeleteHardUserTenantPreference,
      PermissionKey.DeleteHardUserTenantPreferenceNum,
    ],
  })
  @del(`${baseUrl}/{id}/hard`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'UserTenantPrefs DELETE hard success',
  })
  async deleteHardById(@param.path.string('id') id: string): Promise<void> {
    const userTenantPrefs = await this.userTenantPrefsRepository.findById(id);
    if (userTenantPrefs.userTenantId !== this.currentUser.userTenantId) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return this.userTenantPrefsRepository.deleteByIdHard(id);
  }
}
