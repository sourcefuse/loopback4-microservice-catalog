import {inject} from '@loopback/core';
import {
  HttpErrors,
  SchemaObject,
  getJsonSchema,
  getModelSchemaRef,
  post,
  response,
} from '@loopback/rest';
import {file, multipartRequestBody} from '../../../../decorators';
import {FileTypeValidator} from '../../../../services';
import {MulterS3Storage} from '../../../../sub-packages/s3';
import {S3File} from '../../../../types';
import {Parent, ParentWithConfig} from '../models';

export type ParentWithFile = Parent & {file: S3File};
export type ParentWithMultipleFiles = Parent & {files: S3File[]};

export type ParentWithModelConfig = ParentWithConfig & {file: S3File};

export class ParentController {
  constructor(
    @inject('services.ReceiverStub')
    private readonly receiverStub: {
      receive: (data: ParentWithFile | ParentWithMultipleFiles) => void;
    },
  ) {}
  @post('/parents')
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async create(
    @file(getJsonSchema(Parent) as SchemaObject, ['file'], ['.csv', '.txt'])
    data: ParentWithFile,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }

  @post('/parents/no-av-check')
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async createAvCheck(
    @file(
      getJsonSchema(Parent) as SchemaObject,
      ['file'],
      ['.csv', '.txt'],
      undefined,
      {
        validators: [FileTypeValidator],
      },
    )
    data: ParentWithFile,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }

  @post('/parents/s3')
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async createS3(
    @file(
      getJsonSchema(Parent) as SchemaObject,
      ['file'],
      ['.csv'],
      {
        storageClass: MulterS3Storage,
        options: {
          bucket: process.env.AWS_S3_BUCKET ?? '',
        },
      },
      {
        validators: [FileTypeValidator],
      },
    )
    data: ParentWithFile,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }

  @post(`/parents/model-metadata`)
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async createWithModel(
    @multipartRequestBody(Parent)
    data: ParentWithFile,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }

  @post(`/parents/no-model-metadata`)
  @response(200, {
    description: 'Parent without config model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(ParentWithConfig)},
    },
  })
  async createWithOutModelConfig(
    @multipartRequestBody(ParentWithConfig)
    data: ParentWithModelConfig,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }

  @post('/parents/s3/error')
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async createS3Error(
    @file(getJsonSchema(Parent) as SchemaObject, ['file'], ['.csv'], {
      storageClass: MulterS3Storage,
      options: {
        bucket: process.env.AWS_S3_BUCKET ?? '',
      },
    })
    data: ParentWithFile,
  ): Promise<void> {
    throw new HttpErrors.BadRequest();
  }

  @post('/parents/binary')
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async createBinary(
    @file(
      getJsonSchema(Parent) as SchemaObject,
      ['file'],
      ['.png'],
      undefined,
      {
        validators: [FileTypeValidator],
      },
    )
    data: ParentWithFile,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }
}
