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
import {Role} from '../models';
import {RoleRepository} from '../repositories';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import { PermissionKey } from '../enums';
import { OPERATION_SECURITY_SPEC, SECURITY_SCHEME_SPEC } from '@sourceloop/core';
export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository : RoleRepository,
  ) {}

  
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateRoles, PermissionKey.CreateRolesNum],
  })
  @post('/roles',{security:OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Role model instance',
    content: {'application/json': {schema: getModelSchemaRef(Role)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRole',
            exclude: ['id'],
          }),
        },
      },
    })
    role: Omit<Role, 'id'>,
  ): Promise<Role> {
    return this.roleRepository.create(role);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewRoles, PermissionKey.ViewRolesNum],
  })
  @get('/roles/count',{security:OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Role model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.count(where);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewRoles, PermissionKey.ViewRolesNum],
  })
  @get('/roles',{security:OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Array of Role model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Role, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Role) filter?: Filter<Role>,
  ): Promise<Role[]> {
    return this.roleRepository.find(filter);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateRoles, PermissionKey.UpdateRolesNum],
  })
  @patch('/roles',{security:OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Role PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Role,
    @param.where(Role) where?: Where<Role>,
  ): Promise<Count> {
    return this.roleRepository.updateAll(role, where);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewRoles, PermissionKey.ViewRolesNum],
  })
  @get('/roles/{id}',{security:OPERATION_SECURITY_SPEC,responses:{}})
  @response(200, {
    description: 'Role model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Role, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Role, {exclude: 'where'}) filter?: FilterExcludingWhere<Role>
  ): Promise<Role> {
    return this.roleRepository.findById(id, filter);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateRoles, PermissionKey.UpdateRoles],
  })
  @patch('/roles/{id}',{security:OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'Role PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Role,
  ): Promise<void> {
    await this.roleRepository.updateById(id, role);
  }



  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateRoles, PermissionKey.UpdateRolesNum],
  })
  @put('/roles/{id}',{security:OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'Role PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() role: Role,
  ): Promise<void> {
    await this.roleRepository.replaceById(id, role);
  }


  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteRoles, PermissionKey.DeleteRolesNum],
  })
  @del('/roles/{id}',{security:OPERATION_SECURITY_SPEC,responses:{}})
  @response(204, {
    description: 'Role DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.roleRepository.deleteById(id);
  }
}
