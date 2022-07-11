// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {Contracts, OcrResults} from '../models';
import {OcrResultRepository, ContractRepository} from '../repositories';
import {OcrObjectFormatterService} from '../services';
import {OcrClause} from '../types';

export class OcrHooksController {
  constructor(
    @repository(OcrResultRepository)
    public ocrResultRepository: OcrResultRepository,
    @repository(ContractRepository)
    public contractRepository: ContractRepository,
    @inject('services.OcrObjectFormatterService')
    public ocrObjectFormatter: OcrObjectFormatterService,
  ) {}

  @post('/webhook/contract-upload', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Contracts Model Instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Contracts)},
        },
      },
    },
  })
  async uploadContractFile(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Contracts, {exclude: ['id']}),
        },
      },
    })
    contract: Omit<Contracts, 'id'>,
  ): Promise<Contracts> {
    contract.contractUploaded = true;
    return this.contractRepository.create(contract);
  }

  @post('/webhook/img-convert', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Image Convert Success',
      },
    },
  })
  async convertContractImages(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Contracts, {exclude: ['id']}),
        },
      },
    })
    contract: Contracts,
  ): Promise<void> {
    contract.imageConverted = true;
    return this.contractRepository.updateById(contract.id, contract);
  }

  @post('/webhook/ocr-convert', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'OCR Convert Success',
      },
    },
  })
  async convertContractOcr(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Contracts, {exclude: ['id']}),
        },
      },
    })
    contract: Contracts,
  ): Promise<void> {
    contract.ocrConverted = true;
    return this.contractRepository.updateById(contract.id, contract);
  }

  @post('/webhook/hocr-convert', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'HOCR Convert Success',
      },
    },
  })
  async convertContractHocr(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Contracts, {exclude: ['id']}),
        },
      },
    })
    contract: Contracts,
  ): Promise<void> {
    contract.hocrConverted = true;
    return this.contractRepository.updateById(contract.id, contract);
  }

  @post('/webhook/{clause_type}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'OcrResults Model Instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(OcrResults)},
        },
      },
    },
  })
  async createContractData(
    @param.path.string('clause_type') clauseType: string,
    @requestBody()
    ocrClause: OcrClause,
  ): Promise<OcrResults> {
    const ocrObject: Partial<OcrResults> = await this.ocrObjectFormatter.format(
      ocrClause,
    );
    return this.ocrResultRepository.create(ocrObject);
  }
}
