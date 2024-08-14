import {
  SchemaObject,
  getJsonSchema,
  getModelSchemaRef,
  post,
  response,
} from '@loopback/rest';
import {Parent} from '../models';
import {file} from '../../../../decorators';
import {inject} from '@loopback/core';
import {S3File} from '../../../../types';
import {MulterS3Storage} from '../../../../services';

export type ParentWithFile = Parent & {file: S3File};

export class ParentController {
  constructor(
    @inject('services.ReceiverStub')
    private readonly receiverStub: {receive: (data: ParentWithFile) => void},
  ) {}
  @post('/parents')
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async create(
    @file(getJsonSchema(Parent) as SchemaObject, ['file'], ['.csv'])
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
    @file(getJsonSchema(Parent) as SchemaObject, ['file'], ['.csv'], {
      storageClass: MulterS3Storage,
      options: {
        bucket: process.env.AWS_S3_BUCKET ?? '',
      },
    })
    data: ParentWithFile,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }

  @post('/parents/binary')
  @response(200, {
    description: 'Parent model instance',
    content: {'application/json': {schema: getModelSchemaRef(Parent)}},
  })
  async createBinary(
    @file(getJsonSchema(Parent) as SchemaObject, ['file'], ['.png'])
    data: ParentWithFile,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }
}
