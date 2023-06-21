import {inject, service} from '@loopback/core';
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
import {CONTENT_TYPE, ILogger, LOGGER, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {OptionsRepository} from '../repositories/options.repository';
import {QuestionRepository} from '../repositories';
import {QuestionHelperService} from '../services';
import {PermissionKey} from '../enum/permission-key.enum';
import {Options} from '../models';
import {BulkDeleteDto} from '../models/bulk-delete-dto.model';
import {QuestionOptionService} from '../services/question-option.service';

const basePath = '/question/{questionId}/options';

export class OptionController {
  constructor(
    @repository(OptionsRepository)
    private optionsRepository: OptionsRepository,
    @repository(QuestionRepository)
    private questionRepository: QuestionRepository,
    @service(QuestionHelperService)
    private questionHelperService: QuestionHelperService,
    @service(QuestionOptionService)
    private questionOptionService: QuestionOptionService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.CreateOption, PermissionKey.CreateAnyOption],
  })
  @post(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Options model instance',
    content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Options)}},
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Options, {
            title: 'NewOptions',
            exclude: ['id'],
          }),
        },
      },
    })
    options: Omit<Options, 'id'>,
    @param.path.string('questionId') questionId: string,
  ): Promise<Options> {
    await Promise.all([
      this.questionHelperService.checkAndGetIfAllowedQuestionToUpdate(
        questionId,
      ),
      this.questionOptionService.validateOptionCount(questionId),
    ]);

    options.questionId = questionId;
    const created = await this.optionsRepository.create(options);
    const foundOption = await this.optionsRepository.findOne({
      order: ['created_on DESC'],
      where: {},
    });
    return foundOption ?? created;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewOption, PermissionKey.ViewAnyOption],
  })
  @get(`${basePath}/count`)
  @response(STATUS_CODE.OK, {
    description: 'Options model count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async count(
    @param.path.string('questionId') questionId: string,
    @param.where(Options) where?: Where<Options>,
  ): Promise<Count> {
    return this.optionsRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewOption, PermissionKey.ViewAnyOption],
  })
  @get(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Array of Options model instances',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Options, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.string('questionId') questionId: string,
    @param.filter(Options) filter?: Filter<Options>,
  ): Promise<Options[]> {
    return this.questionRepository.options(questionId).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateOption, PermissionKey.UpdateAnyOption],
  })
  @patch(basePath)
  @response(STATUS_CODE.OK, {
    description: 'Options PATCH success count',
    content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Options, {partial: true}),
        },
      },
    })
    options: Options,
    @param.path.string('questionId') questionId: string,
    @param.where(Options) where?: Where<Options>,
  ): Promise<Count> {
    return this.questionRepository.options(questionId).patch(options, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewOption, PermissionKey.ViewAnyOption],
  })
  @get(`${basePath}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'Options model instance',
    content: {
      [CONTENT_TYPE.JSON]: {
        schema: getModelSchemaRef(Options, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('questionId') questionId: string,
    @param.path.string('id') id: string,
    @param.filter(Options, {exclude: 'where'})
    filter?: FilterExcludingWhere<Options>,
  ): Promise<Options> {
    const option = await this.optionsRepository.findOne(filter);
    if (!option) {
      throw new HttpErrors.NotFound();
    }
    return option;
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateOption, PermissionKey.UpdateAnyOption],
  })
  @patch(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Options PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Options, {partial: true}),
        },
      },
    })
    options: Options,
    @param.path.string('questionId') questionId: string,
  ): Promise<void> {
    await this.questionHelperService.checkAndGetIfAllowedQuestionToUpdate(
      questionId,
    );
    const existingOption = await this.optionsRepository.findOne({
      where: {id, questionId},
    });
    if (!existingOption) {
      throw new HttpErrors.NotFound();
    }
    await this.optionsRepository.updateById(id, options);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteOption, PermissionKey.DeleteAnyOption],
  })
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Options DELETE success',
  })
  async deleteById(
    @param.path.string('questionId') questionId: string,
    @param.path.string('id') id: string,
  ): Promise<void> {
    const existingOption = await this.optionsRepository.findOne({
      where: {id, questionId},
    });
    if (!existingOption) {
      throw new HttpErrors.NotFound();
    }
    await this.optionsRepository.deleteById(id);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.DeleteOption, PermissionKey.DeleteAnyOption],
  })
  @post(`${basePath}/delete/bulk`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Option bulk DELETE success',
  })
  async deleteAllOptions(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(BulkDeleteDto, {
            title: 'BulkDeleteOption',
          }),
        },
      },
    })
    option: BulkDeleteDto,
    @param.path.string('questionId') questionId: string,
  ): Promise<void> {
    await this.optionsRepository.deleteAll({
      id: {inq: option.ids},
      questionId,
    });
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.UpdateOption, PermissionKey.UpdateAnyOption],
  })
  @patch(`${basePath}/many`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Options PATCH MANY success',
  })
  async updateMany(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Options, {partial: true}),
          },
        },
      },
    })
    options: Options[],
    @param.path.string('questionId') questionId: string,
  ): Promise<void> {
    const promiseArray = options.map(option =>
      this.optionsRepository.updateAll(option, {
        id: option.id,
        questionId,
      }),
    );
    await Promise.all(promiseArray);
  }
}
