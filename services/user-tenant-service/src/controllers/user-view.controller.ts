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
import {UserView} from '../models';
import {UserViewRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserViewController {
  constructor(
    @repository(UserViewRepository)
    public userViewRepository : UserViewRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateUser],
  })
  @post('/user-views',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserView model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserView)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserView, {
            title: 'NewUserView',
            exclude: ['id'],
          }),
        },
      },
    })
    userView: Omit<UserView, 'id'>,
  ): Promise<UserView> {
    return this.userViewRepository.create(userView);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUser],
  })
  @get('/user-views/count',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserView model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserView) where?: Where<UserView>,
  ): Promise<Count> {
    return this.userViewRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUser],
  })
  @get('/user-views',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Array of UserView model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserView, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserView) filter?: Filter<UserView>,
  ): Promise<UserView[]> {
    return this.userViewRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateUser],
  })
  @patch('/user-views',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserView PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserView, {partial: true}),
        },
      },
    })
    userView: UserView,
    @param.where(UserView) where?: Where<UserView>,
  ): Promise<Count> {
    return this.userViewRepository.updateAll(userView, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUser],
  })
  @get('/user-views/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'UserView model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserView, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserView, {exclude: 'where'}) filter?: FilterExcludingWhere<UserView>
  ): Promise<UserView> {
    return this.userViewRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateUser],
  })
  @patch('/user-views/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserView PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserView, {partial: true}),
        },
      },
    })
    userView: UserView,
  ): Promise<void> {
    await this.userViewRepository.updateById(id, userView);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateUser],
  })
  @put('/user-views/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserView PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userView: UserView,
  ): Promise<void> {
    await this.userViewRepository.replaceById(id, userView);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteUser],
  })
  @del('/user-views/{id}',{security: OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'UserView DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userViewRepository.deleteById(id);
  }
}
