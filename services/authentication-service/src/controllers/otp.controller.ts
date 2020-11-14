import {repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';

import {Otp} from '../models';
import {OtpRepository} from '../repositories';
import {authorize} from 'loopback4-authorization';
import {STATUS_CODE, CONTENT_TYPE} from '@sourceloop/core';

const otpCacheTtl = 900000;

export class OtpController {
  constructor(
    @repository(OtpRepository)
    public otpRepository: OtpRepository,
  ) {}

  @authorize({permissions: ['*']})
  @post('/otp-caches', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Otp model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Otp)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Otp),
        },
      },
    })
    otp: Otp,
  ): Promise<void> {
    await this.otpRepository.set(otp.username, otp, {ttl: otpCacheTtl});
  }

  @authorize({permissions: ['*']})
  @get('/otp-caches/{id}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Otp model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Otp)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Otp> {
    return this.otpRepository.get(id);
  }

  @authorize({permissions: ['*']})
  @del('/otp-caches/{id}', {
    responses: {
      '204': {
        description: 'Otp DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.otpRepository.delete(id);
  }
}
