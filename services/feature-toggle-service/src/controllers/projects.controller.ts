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
import {STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Projects} from '../models';
import {ProjectsRepository} from '../repositories';

const basePath = '/projects';
export class ProjectsController {
  constructor(
    @repository(ProjectsRepository)
    public projectsRepository: ProjectsRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Projects model instance',
    content: {'application/json': {schema: getModelSchemaRef(Projects)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Projects, {
            title: 'NewProjects',
          }),
        },
      },
    })
    projects: Projects,
  ): Promise<Projects> {
    return this.projectsRepository.create(projects);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'Projects model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Projects) where?: Where<Projects>): Promise<Count> {
    return this.projectsRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Array of Projects model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Projects, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Projects) filter?: Filter<Projects>,
  ): Promise<Projects[]> {
    return this.projectsRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @patch(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Projects PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Projects, {partial: true}),
        },
      },
    })
    projects: Projects,
    @param.where(Projects) where?: Where<Projects>,
  ): Promise<Count> {
    return this.projectsRepository.updateAll(projects, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'Projects model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Projects, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Projects, {exclude: 'where'})
    filter?: FilterExcludingWhere<Projects>,
  ): Promise<Projects> {
    return this.projectsRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Projects PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Projects, {partial: true}),
        },
      },
    })
    projects: Projects,
  ): Promise<void> {
    await this.projectsRepository.updateById(id, projects);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @put(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Projects PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() projects: Projects,
  ): Promise<void> {
    await this.projectsRepository.replaceById(id, projects);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Projects DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.projectsRepository.deleteById(id);
  }
}
