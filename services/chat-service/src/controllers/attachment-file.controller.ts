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
  response,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums';
import {AttachmentFile} from '../models/attachment-file.model';
import {AttachmentFileDto} from '../models/attachment-file-dto.model';
import {AttachmentFileRepository} from '../repositories/attachment.repository';
const basePath = '/attach-files';
export class AttachmentFileController {
  constructor(
    @repository(AttachmentFileRepository)
    public attachmentFileRepository: AttachmentFileRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateAttachmentFile]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attachment model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(AttachmentFile)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(AttachmentFile, {
            title: 'NewAttachmentFile',
            exclude: ['id'],
          }),
        },
      },
    })
    attachFile: Omit<AttachmentFile, 'id'>,
  ): Promise<AttachmentFile> {
    return this.attachmentFileRepository.create(attachFile);
  }
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateAttachmentFile]})
  @post(`${basePath}/bulk`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Attachment model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(AttachmentFileDto)},
        },
      },
    },
  })
  async createBulk(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(AttachmentFileDto, {
            title: 'New Attachment Files',
          }),
        },
      },
    })
    attachFileDto: AttachmentFileDto,
  ): Promise<AttachmentFile[]> {
    const attachFiles: AttachmentFile[] = [];
    attachFileDto.attachmentFiles.forEach(messageFile => {
      attachFiles.push(new AttachmentFile(messageFile));
    });
    return this.attachmentFileRepository.createAll(attachFiles);
  }
  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewAttachmentFile]})
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AttachmentFile model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(AttachmentFile) where?: Where<AttachmentFile>,
  ): Promise<Count> {
    return this.attachmentFileRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewAttachmentFile]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of AttachmentFile model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(AttachmentFile, {
                includeRelations: true,
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(AttachmentFile) filter?: Filter<AttachmentFile>,
  ): Promise<AttachmentFile[]> {
    return this.attachmentFileRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateAttachmentFile]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AttachmentFile PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(AttachmentFile, {partial: true}),
        },
      },
    })
    attachFile: AttachmentFile,
    @param.where(AttachmentFile) where?: Where<AttachmentFile>,
  ): Promise<Count> {
    return this.attachmentFileRepository.updateAll(attachFile, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewAttachmentFile]})
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'AttachmentFile model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(AttachmentFile, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(AttachmentFile, {exclude: 'where'})
    filter?: FilterExcludingWhere<AttachmentFile>,
  ): Promise<AttachmentFile> {
    return this.attachmentFileRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateAttachmentFile]})
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'AttachmentFile PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(AttachmentFile, {partial: true}),
        },
      },
    })
    attachFile: AttachmentFile,
  ): Promise<void> {
    await this.attachmentFileRepository.updateById(id, attachFile);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateAttachmentFile]})
  @put(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'AttachmentFile PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() attachFile: AttachmentFile,
  ): Promise<void> {
    await this.attachmentFileRepository.replaceById(id, attachFile);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteAttachmentFile]})
  @del(`${basePath}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Attachment File DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.attachmentFileRepository.deleteById(id);
  }
}
