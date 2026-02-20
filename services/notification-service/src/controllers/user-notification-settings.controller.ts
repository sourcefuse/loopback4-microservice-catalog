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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { UserNotificationSettings } from '../models';
import { UserNotificationSettingsRepository } from '../repositories';

import { getModelSchemaRefSF, STATUS_CODE } from '@sourceloop/core';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';
const basePath = '/user-notification-settings';
export class UserNotificationSettingsController {
  constructor(
    @repository(UserNotificationSettingsRepository)
    public userNotificationSettingsRepository: UserNotificationSettingsRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateNotificationUserSettings],
  })
  @post(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'UserNotificationSettings model instance',
    content: {
      'application/json': {schema: getModelSchemaRefSF(UserNotificationSettings)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(UserNotificationSettings, {
            title: 'NewUserNotificationSettings',
            exclude: ['id'],
          }),
        },
      },
    })
    userNotificationSettings: Omit<UserNotificationSettings, 'id'>,
  ): Promise<UserNotificationSettings> {
    const isExists = await this.verifyIfAlreadyExists(
      userNotificationSettings.userId,
    );
    if (isExists) {
      throw new HttpErrors.Forbidden('Settings for this user already exists.');
    }
    return this.userNotificationSettingsRepository.create(
      userNotificationSettings,
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewNotificationUserSettings],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'UserNotificationSettings model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserNotificationSettings)
    where?: Where<UserNotificationSettings>,
  ): Promise<Count> {
    return this.userNotificationSettingsRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewNotificationUserSettings],
  })
  @get(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'Array of UserNotificationSettings model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRefSF(UserNotificationSettings, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @param.filter(UserNotificationSettings)
    filter?: Filter<UserNotificationSettings>,
  ): Promise<UserNotificationSettings[]> {
    return this.userNotificationSettingsRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateNotificationUserSettings],
  })
  @patch(`${basePath}`)
  @response(STATUS_CODE.OK, {
    description: 'UserNotificationSettings PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(UserNotificationSettings, {partial: true}),
        },
      },
    })
    userNotificationSettings: UserNotificationSettings,
  ): Promise<Count> {
    return this.userNotificationSettingsRepository.updateAll(
      userNotificationSettings,
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewNotificationUserSettings],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'UserNotificationSettings model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRefSF(UserNotificationSettings, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<UserNotificationSettings> {
    return this.userNotificationSettingsRepository.findById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateNotificationUserSettings],
  })
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'UserNotificationSettings PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRefSF(UserNotificationSettings, {partial: true}),
        },
      },
    })
    userNotificationSettings: UserNotificationSettings,
  ): Promise<void> {
    const isExists = await this.verifyIfAlreadyExists(
      userNotificationSettings.userId,
      id,
    );
    if (isExists) {
      throw new HttpErrors.Forbidden(
        'Settings for this user already exists in DB.',
      );
    }
    await this.userNotificationSettingsRepository.updateById(
      id,
      userNotificationSettings,
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateNotificationUserSettings],
  })
  @put(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'UserNotificationSettings PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userNotificationSettings: UserNotificationSettings,
  ): Promise<void> {
    const isExists = await this.verifyIfAlreadyExists(
      userNotificationSettings.userId,
      id,
    );
    if (isExists) {
      throw new HttpErrors.Forbidden(
        'Settings for this user already exists in DB.',
      );
    }
    await this.userNotificationSettingsRepository.replaceById(
      id,
      userNotificationSettings,
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.DeleteNotificationUserSettings],
  })
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'UserNotificationSettings DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userNotificationSettingsRepository.deleteById(id);
  }

  async verifyIfAlreadyExists(userId: string, id = '') {
    let where = {};
    if (id) {
      where = {where: {userId: {eq: userId}, id: {neq: id}}};
    } else {
      where = {where: {userId: {eq: userId}}};
    }
    const setting = await this.userNotificationSettingsRepository.find(where);
    if (setting?.length > 0) {
      return true;
    }
    return false;
  }
}
