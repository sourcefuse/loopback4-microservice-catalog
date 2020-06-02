import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Settings} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {SettingsRepository} from '../repositories';

const basePath = '/settings';

export class SettingsController {
  constructor(
    @repository(SettingsRepository)
    public settingsRepository: SettingsRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateSettings])
  @post(basePath, {
    responses: {
      '200': {
        description: 'Settings model instance',
        content: {'application/json': {schema: getModelSchemaRef(Settings)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Settings, {
            title: 'NewSettings',
          }),
        },
      },
    })
    settings: Settings,
  ): Promise<Settings> {
    return this.settingsRepository.create(settings);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewSettings])
  @get(`${basePath}/count`, {
    responses: {
      '200': {
        description: 'Settings model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Settings) where?: Where<Settings>): Promise<Count> {
    return this.settingsRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewSettings])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Array of Settings model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Settings, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Settings) filter?: Filter<Settings>,
  ): Promise<Settings[]> {
    return this.settingsRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateSettings])
  @patch(basePath, {
    responses: {
      '200': {
        description: 'Settings PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Settings, {partial: true}),
        },
      },
    })
    settings: Settings,
    @param.where(Settings) where?: Where<Settings>,
  ): Promise<Count> {
    return this.settingsRepository.updateAll(settings, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewSettings])
  @get(`${basePath}/{id}`, {
    responses: {
      '200': {
        description: 'Settings model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Settings, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Settings, {exclude: 'where'})
    filter?: FilterExcludingWhere<Settings>,
  ): Promise<Settings> {
    return this.settingsRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateSettings])
  @patch(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Settings PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Settings, {partial: true}),
        },
      },
    })
    settings: Settings,
  ): Promise<void> {
    await this.settingsRepository.updateById(id, settings);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateSettings])
  @put(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Settings PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() settings: Settings,
  ): Promise<void> {
    await this.settingsRepository.replaceById(id, settings);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteSettings])
  @del(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Settings DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.settingsRepository.deleteById(id);
  }
}
