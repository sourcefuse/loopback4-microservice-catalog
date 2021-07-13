import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {getModelSchemaRef, param, requestBody} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Theme} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {ThemeRepository} from '../repositories';
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

const basePath = '/themes';

export class ThemeController {
  constructor(
    @repository(ThemeRepository)
    public themeRepository: ThemeRepository,
  ) {}

  @sourceloopPost(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Theme model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Theme)}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateTheme]})
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
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

  @sourceloopGet(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Theme model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewTheme]})
  async count(@param.where(Theme) where?: Where<Theme>): Promise<Count> {
    return this.themeRepository.count(where);
  }

  @sourceloopGet(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Theme model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Theme, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewTheme]})
  async find(@param.filter(Theme) filter?: Filter<Theme>): Promise<Theme[]> {
    return this.themeRepository.find(filter);
  }

  @sourceloopPatch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Theme PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateTheme]})
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Theme, {partial: true}),
        },
      },
    })
    theme: Theme,
    @param.where(Theme) where?: Where<Theme>,
  ): Promise<Count> {
    return this.themeRepository.updateAll(theme, where);
  }

  @sourceloopGet(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Theme model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Theme, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewTheme]})
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Theme, {exclude: 'where'})
    filter?: FilterExcludingWhere<Theme>,
  ): Promise<Theme> {
    return this.themeRepository.findById(id, filter);
  }

  @sourceloopPatch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Theme PATCH success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateTheme]})
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Theme, {partial: true}),
        },
      },
    })
    theme: Theme,
  ): Promise<void> {
    await this.themeRepository.updateById(id, theme);
  }

  @sourceloopPut(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Theme PUT success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateTheme]})
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() theme: Theme,
  ): Promise<void> {
    await this.themeRepository.replaceById(id, theme);
  }

  @sourceloopDelete(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Theme DELETE success',
      },
    },
  })
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteTheme]})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.themeRepository.deleteById(id);
  }
}
