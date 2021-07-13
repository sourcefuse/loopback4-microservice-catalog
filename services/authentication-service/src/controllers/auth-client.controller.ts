import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  param,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
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
  sourceloopPost,
  sourceloopGet,
  sourceloopPatch,
  sourceloopPut,
  sourceloopDelete,
} from '@sourceloop/core';
import {PermissionKey} from '../permission-key.enum';

const baseUrl = '/auth-clients';
export class AuthClientController {
  constructor(
    @repository(AuthClientRepository)
    public authClientRepository: AuthClientRepository,
  ) {}

  @sourceloopPost(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuthClient model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(AuthClient)}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
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

  @sourceloopGet(`${baseUrl}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuthClient model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  async count(
    @param.query.object('where', getWhereSchemaFor(AuthClient))
    where?: Where<AuthClient>,
  ): Promise<Count> {
    return this.authClientRepository.count(where);
  }

  @sourceloopGet(baseUrl, {
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
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  async find(
    @param.query.object('filter', getFilterSchemaFor(AuthClient))
    filter?: Filter<AuthClient>,
  ): Promise<AuthClient[]> {
    return this.authClientRepository.find(filter);
  }

  @sourceloopPatch(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuthClient PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
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

  @sourceloopGet(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AuthClient model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(AuthClient)}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  async findById(@param.path.number('id') id: number): Promise<AuthClient> {
    return this.authClientRepository.findById(id);
  }

  @sourceloopPatch(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'AuthClient PATCH success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
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

  @sourceloopPut(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'AuthClient PUT success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() authClient: AuthClient,
  ): Promise<void> {
    await this.authClientRepository.replaceById(id, authClient);
  }

  @sourceloopDelete(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'AuthClient DELETE success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.NotAllowed]})
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.authClientRepository.deleteById(id);
  }
}
