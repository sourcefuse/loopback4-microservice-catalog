import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
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
} from '@loopback/rest';
import {AuthClient} from '../models';
import {AuthClientRepository} from '../repositories';
import {authorize} from 'loopback4-authorization';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {PermissionKey} from '../permission-key.enum';

const baseUrl = '/auth-clients';
export class AuthClientController {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  @post(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuthClient model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(AuthClient)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(AuthClient, {exclude: ['id']}),
        },
      },
    })
    authClient: Omit<AuthClient, 'id'>,
  ): Promise<AuthClient> {
    return this.authClientRepository.create(authClient);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  @get(`${baseUrl}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuthClient model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(AuthClient))
    where?: Where<AuthClient>,
  ): Promise<Count> {
    return this.authClientRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of AuthClient model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(AuthClient)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(AuthClient))
    filter?: Filter<AuthClient>,
  ): Promise<AuthClient[]> {
    return this.authClientRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  @patch(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuthClient PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(AuthClient, {partial: true}),
        },
      },
    })
    authClient: AuthClient,
    @param.query.object('where', getWhereSchemaFor(AuthClient))
    where?: Where<AuthClient>,
  ): Promise<Count> {
    return this.authClientRepository.updateAll(authClient, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  @get(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuthClient model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(AuthClient)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<AuthClient> {
    return this.authClientRepository.findById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  @patch(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'AuthClient PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(AuthClient, {partial: true}),
        },
      },
    })
    authClient: AuthClient,
  ): Promise<void> {
    await this.authClientRepository.updateById(id, authClient);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  @put(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'AuthClient PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() authClient: AuthClient,
  ): Promise<void> {
    await this.authClientRepository.replaceById(id, authClient);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  @del(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'AuthClient DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.authClientRepository.deleteById(id);
  }
}
