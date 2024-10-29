import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
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
  response,
} from '@loopback/rest';
import {Test} from '../models';
import {cacheInvalidator, cachedItem} from '../../../decorators';
import {TestWithoutCachingRepository} from '../repositories';
import {ICacheService, ICachedService} from '../../../types';
import {inject} from '@loopback/core';
import {CacheComponentBindings} from '../../../keys';

export class TestController implements ICachedService {
  constructor(
    @repository(TestWithoutCachingRepository)
    public testModelRepository: TestWithoutCachingRepository,
    @inject(CacheComponentBindings.CacheService)
    public cache: ICacheService,
  ) {}
  cacheIdentifier = 'testRepo';

  @cacheInvalidator()
  @post('/tests')
  @response(200, {
    description: 'Test model instance',
    content: {'application/json': {schema: getModelSchemaRef(Test)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, {
            title: 'NewTest',
            exclude: ['id'],
          }),
        },
      },
    })
    testModel: Omit<Test, 'id'>,
  ): Promise<Test> {
    return this.testModelRepository.create(testModel);
  }

  @cachedItem()
  @get('/tests/count')
  @response(200, {
    description: 'Test model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Test) where?: Where<Test>): Promise<Count> {
    return this.testModelRepository.count(where);
  }

  @cachedItem()
  @get('/tests')
  @response(200, {
    description: 'Array of Test model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Test, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Test) filter?: Filter<Test>): Promise<Test[]> {
    return this.testModelRepository.find(filter);
  }

  @cacheInvalidator()
  @patch('/tests')
  @response(200, {
    description: 'Test PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, {partial: true}),
        },
      },
    })
    testModel: Test,
    @param.where(Test) where?: Where<Test>,
  ): Promise<Count> {
    return this.testModelRepository.updateAll(testModel, where);
  }

  @cachedItem()
  @get('/tests/{id}')
  @response(200, {
    description: 'Test model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Test, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: number,
    @param.filter(Test, {exclude: 'where'})
    filter?: FilterExcludingWhere<Test>,
  ): Promise<Test> {
    return this.testModelRepository.findById(id, filter);
  }

  @cacheInvalidator()
  @patch('/tests/{id}')
  @response(204, {
    description: 'Test PATCH success',
  })
  async updateById(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, {partial: true}),
        },
      },
    })
    testModel: Test,
  ): Promise<void> {
    await this.testModelRepository.updateById(id, testModel);
  }

  @cacheInvalidator()
  @put('/tests/{id}')
  @response(204, {
    description: 'Test PUT success',
  })
  async replaceById(
    @param.path.string('id') id: number,
    @requestBody() testModel: Test,
  ): Promise<void> {
    await this.testModelRepository.replaceById(id, testModel);
  }

  @cacheInvalidator()
  @del('/tests/{id}')
  @response(204, {
    description: 'Test DELETE success',
  })
  async deleteById(@param.path.string('id') id: number): Promise<void> {
    await this.testModelRepository.deleteById(id);
  }
}
