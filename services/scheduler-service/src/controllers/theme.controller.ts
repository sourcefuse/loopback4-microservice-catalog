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
import {Theme} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {ThemeRepository} from '../repositories';

const basePath = '/themes';

export class ThemeController {
  constructor(
    @repository(ThemeRepository)
    public themeRepository: ThemeRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateTheme])
  @post(basePath, {
    responses: {
      '200': {
        description: 'Theme model instance',
        content: {'application/json': {schema: getModelSchemaRef(Theme)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Theme, {
            title: 'NewTheme',
            exclude: ['id'],
          }),
        },
      },
    })
    theme: Omit<Theme, 'id'>,
  ): Promise<Theme> {
    return this.themeRepository.create(theme);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewTheme])
  @get(`${basePath}/count`, {
    responses: {
      '200': {
        description: 'Theme model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Theme) where?: Where<Theme>): Promise<Count> {
    return this.themeRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewTheme])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Array of Theme model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Theme, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Theme) filter?: Filter<Theme>): Promise<Theme[]> {
    return this.themeRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateTheme])
  @patch(basePath, {
    responses: {
      '200': {
        description: 'Theme PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Theme, {partial: true}),
        },
      },
    })
    theme: Theme,
    @param.where(Theme) where?: Where<Theme>,
  ): Promise<Count> {
    return this.themeRepository.updateAll(theme, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewTheme])
  @get(`${basePath}/{id}`, {
    responses: {
      '200': {
        description: 'Theme model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Theme, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Theme, {exclude: 'where'})
    filter?: FilterExcludingWhere<Theme>,
  ): Promise<Theme> {
    return this.themeRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateTheme])
  @patch(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Theme PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Theme, {partial: true}),
        },
      },
    })
    theme: Theme,
  ): Promise<void> {
    await this.themeRepository.updateById(id, theme);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateTheme])
  @put(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Theme PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() theme: Theme,
  ): Promise<void> {
    await this.themeRepository.replaceById(id, theme);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteTheme])
  @del(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Theme DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.themeRepository.deleteById(id);
  }
}
