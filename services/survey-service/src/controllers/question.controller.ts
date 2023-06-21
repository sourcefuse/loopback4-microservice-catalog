import {service} from '@loopback/core';
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
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {QuestionDto} from '../models/question-dto.model';
import {Question} from '../models';
import {QuestionHelperService} from '../services/question-helper.service';
import {QuestionRepository} from '../repositories';
import {BulkDeleteDto} from '../models/bulk-delete-dto.model';
import {QuestionDuplicateHelperService} from '../services/question-duplicate-helper.service';
import {QuestionDuplicateDto} from '../models/question-duplicate-dto.model';

const basePath = '/questions';

export class QuestionController {
  constructor(
    @repository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @service(QuestionHelperService)
    private questionHelperService: QuestionHelperService,
    @service(QuestionDuplicateHelperService)
    private questionDuplicateHelperService: QuestionDuplicateHelperService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: ['*'],
  })
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Question model instance',
    content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Question)}},
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(QuestionDto, {
            title: 'NewQuestion',
            exclude: ['id'],
          }),
        },
      },
    })
    question: Omit<QuestionDto, 'id'>,
  ): Promise<Question> {
    return this.questionHelperService.createQuestion(question);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: ['*'],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'Question model count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async count(@param.where(Question) where?: Where<Question>): Promise<Count> {
    return this.questionRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: ['*'],
  })
  @get(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Array of Question model instances',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Question, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Question) filter?: Filter<Question>,
  ): Promise<Question[]> {
    return this.questionRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: ['*'],
  })
  @patch(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Question PATCH success count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Question, {partial: true}),
        },
      },
    })
    question: Question,
    @param.where(Question) where?: Where<Question>,
  ): Promise<Count> {
    return this.questionRepository.updateAll(question, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: ['*'],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'Question model instance',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: getModelSchemaRef(Question, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Question, {exclude: 'where'})
    filter?: FilterExcludingWhere<Question>,
  ): Promise<Question> {
    const question = await this.questionRepository.findOne(filter);
    if (!question) {
      throw new HttpErrors.NotFound();
    }
    return question;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: ['*'],
  })
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Question PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Question, {partial: true}),
        },
      },
    })
    question: Question,
  ): Promise<Question> {
    return this.questionHelperService.updateQuestion(id, question);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: ['*'],
  })
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Question DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.questionHelperService.deleteQuestion(id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: ['*'],
  })
  @post(`${basePath}/delete/bulk`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Question bulk DELETE success',
  })
  async deleteAllQuestions(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(BulkDeleteDto, {
            title: 'BulkDeleteQuestion',
          }),
        },
      },
    })
    question: BulkDeleteDto,
  ): Promise<void> {
    let questions;
    questions = await this.questionRepository.find({
      where: {id: {inq: question.ids}},
    });
    const promiseArr = question.ids.map(id =>
      this.questionHelperService.deleteQuestion(id),
    );
    await Promise.all(promiseArr);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: ['*'],
  })
  @post(`${basePath}/{id}/duplicate`)
  @response(STATUS_CODE.OK, {
    description: 'Question Duplicate model instance',
    content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Question)}},
  })
  async duplicate(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(QuestionDuplicateDto, {
            title: 'QuestionDuplicateDto',
          }),
        },
      },
    })
    body: QuestionDuplicateDto,
  ): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: {
        id,
      },
    });
    if (!question) {
      throw new HttpErrors.NotFound();
    }
    return this.questionDuplicateHelperService.duplicateQuestion(id, body);
  }
}
