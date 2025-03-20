import {inject} from '@loopback/core';
import {getModelSchemaRef, post, response} from '@loopback/rest';
import {multipartRequestBody} from '../../../../decorators';
import {MultipartModel} from '../models';

export class MultipartController {
  constructor(
    @inject('services.ReceiverStub')
    private readonly receiverStub: {
      receive: (data: MultipartModel) => void;
    },
  ) {}
  @post(`/multiple`)
  @response(200, {
    description: 'Multipart model instance',
    content: {'application/json': {schema: getModelSchemaRef(MultipartModel)}},
  })
  async createMultiple(
    @multipartRequestBody(MultipartModel)
    data: MultipartModel,
  ): Promise<void> {
    this.receiverStub.receive(data);
  }
}
