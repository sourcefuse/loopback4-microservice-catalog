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
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  UserCredentials,
} from '../models';
import {UserRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { PermissionKey } from '../enums';

export class UserUserCredentialsController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewUser],
  })
  @get('/users/{id}/user-credentials', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User has one UserCredentials',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCredentials),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserCredentials>,
  ): Promise<UserCredentials> {
    return this.userRepository.credentials(id).get(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateUser],
  })
  @post('/users/{id}/user-credentials', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCredentials)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials, {
            title: 'NewUserCredentialsInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userCredentials: Omit<UserCredentials, 'id'>,
  ): Promise<UserCredentials> {
    return this.userRepository.credentials(id).create(userCredentials);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateUser],
  })
  @patch('/users/{id}/user-credentials', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.UserCredentials PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredentials, {partial: true}),
        },
      },
    })
    userCredentials: Partial<UserCredentials>,
    @param.query.object('where', getWhereSchemaFor(UserCredentials)) where?: Where<UserCredentials>,
  ): Promise<Count> {
    return this.userRepository.credentials(id).patch(userCredentials, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteUser],
  })
  @del('/users/{id}/user-credentials', {
    security:OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.UserCredentials DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserCredentials)) where?: Where<UserCredentials>,
  ): Promise<Count> {
    return this.userRepository.credentials(id).delete(where);
  }
}
