import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  WhereBuilder,
  FilterBuilder,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {NotificationUser} from '../models';
import {NotificationUserRepository} from '../repositories';
import {
  authenticate,
  STRATEGY,
  AuthenticationBindings,
} from 'loopback4-authentication';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  IAuthUserWithPermissions,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {authorize, AuthorizeErrorKeys} from 'loopback4-authorization';
import {inject} from '@loopback/core';
import {PermissionKey} from '../enums/permission-key.enum';

const basePath = '/notification-users';

export class NotificationUserController {
  constructor(
    @repository(NotificationUserRepository)
    public notificationUserRepository: NotificationUserRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'NotificationUser model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(NotificationUser)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(NotificationUser, {
            title: 'NewNotificationUser',
            exclude: ['id'],
          }),
        },
      },
    })
    notificationUser: Omit<NotificationUser, 'id'>,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<NotificationUser> {
    if (currentUser.id !== notificationUser.userId) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return this.notificationUserRepository.create(notificationUser);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @post(`${basePath}/bulk`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Notification User model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(NotificationUser)},
        },
      },
    },
  })
  async createAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'array',
            items: getModelSchemaRef(NotificationUser, {
              title: 'NewNotificationUser',
              exclude: ['id'],
            }),
          },
        },
      },
    })
    notificationUsers: Omit<NotificationUser, 'id'>[],
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<NotificationUser[]> {
    const invalidFound = notificationUsers.find(
      notificationUser => currentUser.id !== notificationUser.userId,
    );
    if (invalidFound) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return this.notificationUserRepository.createAll(notificationUsers);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'NotificationUser model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.query.object('where', getWhereSchemaFor(NotificationUser))
    where?: Where<NotificationUser>,
  ): Promise<Count> {
    return this.notificationUserRepository.count(
      this._createWhereBuilder(currentUser, where).build(),
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of NotificationUser model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(NotificationUser)},
          },
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.query.object('filter', getFilterSchemaFor(NotificationUser))
    filter?: Filter<NotificationUser>,
  ): Promise<NotificationUser[]> {
    return this.notificationUserRepository.find(
      this._createFilterBuilder(currentUser, filter).build(),
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'NotificationUser PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(NotificationUser, {partial: true}),
        },
      },
    })
    notificationUser: NotificationUser,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.query.object('where', getWhereSchemaFor(NotificationUser))
    where?: Where<NotificationUser>,
  ): Promise<Count> {
    return this.notificationUserRepository.updateAll(
      notificationUser,
      this._createWhereBuilder(currentUser, where).build(),
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'NotificationUser instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(NotificationUser)},
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<NotificationUser> {
    return this._verifyOwned(id, currentUser);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'NotificationUser PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(NotificationUser, {partial: true}),
        },
      },
    })
    notificationUser: NotificationUser,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<void> {
    await this._verifyOwned(id, currentUser);
    await this.notificationUserRepository.updateById(id, notificationUser);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewNotification]})
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'NotificationUser PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() notificationUser: NotificationUser,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<void> {
    await this._verifyOwned(id, currentUser);
    await this.notificationUserRepository.replaceById(id, notificationUser);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteNotification]})
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'NotificationUser DELETE success',
      },
    },
  })
  async deleteById(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
  ): Promise<void> {
    await this._verifyOwned(id, currentUser);
    await this.notificationUserRepository.deleteById(id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteNotification]})
  @del(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Notification DELETE success',
      },
    },
  })
  async deleteAll(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.query.object('where', getWhereSchemaFor(NotificationUser))
    where?: Where<NotificationUser>,
  ): Promise<Count> {
    return this.notificationUserRepository.deleteAll(
      this._createWhereBuilder(currentUser, where).build(),
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteNotification]})
  @del(`${basePath}/hard`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Notification DELETE success',
      },
    },
  })
  async deleteAllHard(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: IAuthUserWithPermissions,
    @param.query.object('where', getWhereSchemaFor(NotificationUser))
    where?: Where<NotificationUser>,
  ): Promise<Count> {
    return this.notificationUserRepository.deleteAllHard(
      this._createWhereBuilder(currentUser, where).build(),
    );
  }

  private async _verifyOwned(
    id: string,
    currentUser: IAuthUserWithPermissions,
  ) {
    const notificationUser = await this.notificationUserRepository.findById(id);
    if (notificationUser.userId !== currentUser.id) {
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return notificationUser;
  }

  private _createWhereBuilder(
    currentUser: IAuthUserWithPermissions,
    where?: Where<NotificationUser>,
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
    filter: Filter<NotificationUser> = {},
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
