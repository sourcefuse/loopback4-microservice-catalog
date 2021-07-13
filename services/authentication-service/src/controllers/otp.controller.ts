import {repository} from '@loopback/repository';
import {getModelSchemaRef, param, requestBody} from '@loopback/rest';

import {Otp} from '../models';
import {OtpRepository} from '../repositories';
import {authorize} from 'loopback4-authorization';
import {
  STATUS_CODE,
  CONTENT_TYPE,
  sourceloopPost,
  sourceloopGet,
  sourceloopDelete,
} from '@sourceloop/core';

const otpCacheTtl = 900000;

export class OtpController {
  constructor(
    @repository(OtpRepository)
    public otpRepository: OtpRepository,
  ) {}

  @sourceloopPost('/otp-caches', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Otp model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Otp)}},
      },
    },
  })
  @authorize({permissions: ['*']})
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

  @sourceloopGet('/otp-caches/{id}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Otp model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Otp)}},
      },
    },
  })
  @authorize({permissions: ['*']})
  async findById(@param.path.string('id') id: string): Promise<Otp> {
    return this.otpRepository.get(id);
  }

  @sourceloopDelete('/otp-caches/{id}', {
    responses: {
      '204': {
        description: 'Otp DELETE success',
      },
    },
  })
  @authorize({permissions: ['*']})
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.otpRepository.delete(id);
  }
}
