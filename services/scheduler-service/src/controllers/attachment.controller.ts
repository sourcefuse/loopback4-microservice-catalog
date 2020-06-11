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
import {Attachment} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {AttachmentRepository} from '../repositories';

const basePath = '/attachments';

export class AttachmentController {
  constructor(
    @repository(AttachmentRepository)
    public attachmentRepository: AttachmentRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateAttachment])
  @post(basePath, {
    responses: {
      '200': {
        description: 'Attachment model instance',
        content: {'application/json': {schema: getModelSchemaRef(Attachment)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attachment, {
            title: 'NewAttachment',
            exclude: ['id'],
          }),
        },
      },
    })
    attachment: Omit<Attachment, 'id'>,
  ): Promise<Attachment> {
    return this.attachmentRepository.create(attachment);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewAttachment])
  @get(`${basePath}/count`, {
    responses: {
      '200': {
        description: 'Attachment model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Attachment) where?: Where<Attachment>,
  ): Promise<Count> {
    return this.attachmentRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewAttachment])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Array of Attachment model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Attachment, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Attachment) filter?: Filter<Attachment>,
  ): Promise<Attachment[]> {
    return this.attachmentRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateAttachment])
  @patch(basePath, {
    responses: {
      '200': {
        description: 'Attachment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attachment, {partial: true}),
        },
      },
    })
    attachment: Attachment,
    @param.where(Attachment) where?: Where<Attachment>,
  ): Promise<Count> {
    return this.attachmentRepository.updateAll(attachment, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewAttachment])
  @get(`${basePath}/{id}`, {
    responses: {
      '200': {
        description: 'Attachment model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Attachment, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Attachment, {exclude: 'where'})
    filter?: FilterExcludingWhere<Attachment>,
  ): Promise<Attachment> {
    return this.attachmentRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateAttachment])
  @patch(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Attachment PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Attachment, {partial: true}),
        },
      },
    })
    attachment: Attachment,
  ): Promise<void> {
    await this.attachmentRepository.updateById(id, attachment);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateAttachment])
  @put(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Attachment PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() attachment: Attachment,
  ): Promise<void> {
    await this.attachmentRepository.replaceById(id, attachment);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteAttachment])
  @del(`${basePath}/{id}`, {
    responses: {
      '204': {
        description: 'Attachment DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.attachmentRepository.deleteById(id);
  }
}
