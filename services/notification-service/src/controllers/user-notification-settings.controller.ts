import {
  Count,
  CountSchema,
  Filter,
  FilterBuilder,
  FilterExcludingWhere,
  repository,
  Where,
  WhereBuilder,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import { authenticate, AuthenticationBindings, STRATEGY } from 'loopback4-authentication';
import { UserNotificationSettings } from '../models';
import { UserNotificationSettingsRepository } from '../repositories';

import { inject } from '@loopback/core';
import { IAuthUserWithPermissions } from '@sourceloop/core';
import { authorize, AuthorizeErrorKeys } from 'loopback4-authorization';
import { PermissionKey } from '../enums';
export class UserNotificationSettingsController {
  constructor(
    @repository(UserNotificationSettingsRepository)
    public userNotificationSettingsRepository: UserNotificationSettingsRepository,
  ) { }


  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.CreateNotificationUserSettings],
  })
  @post('/user-notification-settings')
  @response(200, {
    description: 'UserNotificationSettings model instance',
    content: { 'application/json': { schema: getModelSchemaRef(UserNotificationSettings) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserNotificationSettings, {
            title: 'NewUserNotificationSettings',
            exclude: ['id'],
          }),
        },
      },
    })
    userNotificationSettings: Omit<UserNotificationSettings, 'id'>,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<UserNotificationSettings> {
    if (currentUser.id !== userNotificationSettings.userId) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return this.userNotificationSettingsRepository.create(userNotificationSettings);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewNotificationUserSettings],
  })
  @get('/user-notification-settings/count')
  @response(200, {
    description: 'UserNotificationSettings model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.where(UserNotificationSettings) where?: Where<UserNotificationSettings>,
  ): Promise<Count> {
    return this.userNotificationSettingsRepository.count(
      this._createWhereBuilder(currentUser, where).build(),
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewNotificationUserSettings],
  })
  @get('/user-notification-settings')
  @response(200, {
    description: 'Array of UserNotificationSettings model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserNotificationSettings, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.filter(UserNotificationSettings) filter?: Filter<UserNotificationSettings>,
  ): Promise<UserNotificationSettings[]> {
    return this.userNotificationSettingsRepository.find(
      this._createFilterBuilder(currentUser, filter).build(),
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateNotificationUserSettings],
  })
  @patch('/user-notification-settings')
  @response(200, {
    description: 'UserNotificationSettings PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserNotificationSettings, { partial: true }),
        },
      },
    })
    userNotificationSettings: UserNotificationSettings,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.where(UserNotificationSettings) where?: Where<UserNotificationSettings>,
  ): Promise<Count> {
    return this.userNotificationSettingsRepository.updateAll(
      userNotificationSettings,
      this._createWhereBuilder(currentUser, where).build(),
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.ViewNotificationUserSettings],
  })
  @get('/user-notification-settings/{id}')
  @response(200, {
    description: 'UserNotificationSettings model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserNotificationSettings, { includeRelations: true }),
      },
    },
  })
  async findById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.path.string('id') id: string,
    @param.filter(UserNotificationSettings, { exclude: 'where' }) filter?: FilterExcludingWhere<UserNotificationSettings>
  ): Promise<UserNotificationSettings> {
    return this._verifyOwned(id, currentUser);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateNotificationUserSettings],
  })
  @patch('/user-notification-settings/{id}')
  @response(204, {
    description: 'UserNotificationSettings PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserNotificationSettings, { partial: true }),
        },
      },
    })
    userNotificationSettings: UserNotificationSettings,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<void> {
    await this._verifyOwned(id, currentUser);
    await this.userNotificationSettingsRepository.updateById(id, userNotificationSettings);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.UpdateNotificationUserSettings],
  })
  @put('/user-notification-settings/{id}')
  @response(204, {
    description: 'UserNotificationSettings PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userNotificationSettings: UserNotificationSettings,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<void> {
    await this._verifyOwned(id, currentUser);
    await this.userNotificationSettingsRepository.replaceById(id, userNotificationSettings);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [PermissionKey.DeleteNotificationUserSettings],
  })
  @del('/user-notification-settings/{id}')
  @response(204, {
    description: 'UserNotificationSettings DELETE success',
  })
  async deleteById(@param.path.string('id') id: string, @inject(AuthenticationBindings.CURRENT_USER)
  currentUser: IAuthUserWithPermissions,): Promise<void> {
    await this._verifyOwned(id, currentUser);
    await this.userNotificationSettingsRepository.deleteById(id);
  }

  private async _verifyOwned(
    id: string,
    currentUser: IAuthUserWithPermissions,
  ) {
    const notificationUser = await this.userNotificationSettingsRepository.findById(id);
    if (notificationUser.userId !== currentUser.id) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return notificationUser;
  }

  private _createWhereBuilder(
    currentUser: IAuthUserWithPermissions,
    where?: Where<UserNotificationSettings>,
  ) {
    const whereBuilder = new WhereBuilder(where);
    whereBuilder.and([
      {
        userId: currentUser.id,
      },
    ]);
    return whereBuilder;
  }

  private _createFilterBuilder(
    currentUser: IAuthUserWithPermissions,
    filter: Filter<UserNotificationSettings> = {},
  ) {
    const filterBuilder = new FilterBuilder(filter);
    if (filter) {
      const whereBuilder = new WhereBuilder(filter.where);
      whereBuilder.and([
        {
          userId: currentUser.id,
        },
      ]);
      filterBuilder.where(whereBuilder.build());
    }
    return filterBuilder;
  }
}
