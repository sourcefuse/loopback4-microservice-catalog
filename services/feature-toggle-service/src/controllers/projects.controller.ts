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
import {Projects} from '../models';
import {ProjectsRepository} from '../repositories';

export class ProjectsController {
  constructor(
    @repository(ProjectsRepository)
    public projectsRepository: ProjectsRepository,
  ) {}

  @post('/projects')
  @response(200, {
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

  @get('/projects/count')
  @response(200, {
    description: 'Projects model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Projects) where?: Where<Projects>): Promise<Count> {
    return this.projectsRepository.count(where);
  }

  @get('/projects')
  @response(200, {
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

  @patch('/projects')
  @response(200, {
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

  @get('/projects/{id}')
  @response(200, {
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

  @patch('/projects/{id}')
  @response(204, {
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

  @put('/projects/{id}')
  @response(204, {
    description: 'Projects PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() projects: Projects,
  ): Promise<void> {
    await this.projectsRepository.replaceById(id, projects);
  }

  @del('/projects/{id}')
  @response(204, {
    description: 'Projects DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.projectsRepository.deleteById(id);
  }
}
