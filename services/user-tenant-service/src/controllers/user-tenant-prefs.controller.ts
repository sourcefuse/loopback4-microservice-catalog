import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserTenantPrefs} from '../models';
import {UserTenantPrefsRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserTenantPrefsController {
  constructor(
    @repository(UserTenantPrefsRepository)
    public userTenantPrefsRepository : UserTenantPrefsRepository,
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
  @post('/user-tenant-prefs',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserTenantPrefs model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserTenantPrefs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenantPrefs, {
            title: 'NewUserTenantPrefs',
            exclude: ['id'],
          }),
        },
      },
    })
    userTenantPrefs: Omit<UserTenantPrefs, 'id'>,
  ): Promise<UserTenantPrefs> {
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
  @get('/user-tenant-prefs/count',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserTenantPrefs model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserTenantPrefs) where?: Where<UserTenantPrefs>,
  ): Promise<Count> {
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
  @get('/user-tenant-prefs',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
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
    return this.userTenantPrefsRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenantPreference,
      PermissionKey.UpdateUserTenantPreferenceNum,
    ],
  })
  @patch('/user-tenant-prefs',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserTenantPrefs PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenantPrefs, {partial: true}),
        },
      },
    })
    userTenantPrefs: UserTenantPrefs,
    @param.where(UserTenantPrefs) where?: Where<UserTenantPrefs>,
  ): Promise<Count> {
    return this.userTenantPrefsRepository.updateAll(userTenantPrefs, where);
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
  @get('/user-tenant-prefs/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserTenantPrefs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserTenantPrefs, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserTenantPrefs, {exclude: 'where'}) filter?: FilterExcludingWhere<UserTenantPrefs>
  ): Promise<UserTenantPrefs> {
    return this.userTenantPrefsRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenantPreference,
      PermissionKey.UpdateUserTenantPreferenceNum,
    ],
  })
  @patch('/user-tenant-prefs/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserTenantPrefs PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenantPrefs, {partial: true}),
        },
      },
    })
    userTenantPrefs: UserTenantPrefs,
  ): Promise<void> {
    await this.userTenantPrefsRepository.updateById(id, userTenantPrefs);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [
      PermissionKey.UpdateUserTenantPreference,
      PermissionKey.UpdateUserTenantPreferenceNum,
    ],
  })
  @put('/user-tenant-prefs/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserTenantPrefs PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userTenantPrefs: UserTenantPrefs,
  ): Promise<void> {
    await this.userTenantPrefsRepository.replaceById(id, userTenantPrefs);
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
  @del('/user-tenant-prefs/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserTenantPrefs DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userTenantPrefsRepository.deleteById(id);
  }
}
