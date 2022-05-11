import { inject } from '@loopback/context';
import { repository } from '@loopback/repository';
import { param, post, requestBody, response } from '@loopback/rest';
import { Contracts } from '../models';
import { OcrResultRepository, ContractRepository } from '../repositories';
import { OcrObjectFormatterService } from '../services';
import { OcrClause } from '../types';

export class OcrHooksController {
  constructor(
    @repository(OcrResultRepository)
    public ocrResultRepository: OcrResultRepository,
    @repository(ContractRepository)
    public contractRepository: ContractRepository,
    @inject('services.OcrObjectFormatterService')
    public ocrObjectFormatter: OcrObjectFormatterService,
  ) { }

  @post('/webhook/contract-upload')
  @response(200, {
    description: 'Upload contract document',
  })
  async uploadContractFile(
    @requestBody() contract: Contracts,
  ): Promise<object> {
    contract.contractUploaded = true;
    return this.contractRepository.create(contract);
  }

  @post('/webhook/img-convert')
  @response(200, {
    description: 'Convert contract document to image',
  })
  async convertContractImages(
    @requestBody() contract: Contracts,
    // eslint-disable-next-line
  ): Promise<any> {
    contract.imageConverted = true;
    return this.contractRepository.updateById(contract.id, contract);
  }

  @post('/webhook/ocr-convert')
  @response(200, {
    description: 'Convert contract ocr',
  })
  async convertContractOcr(
    @requestBody() contract: Contracts,
    // eslint-disable-next-line
  ): Promise<any> {
    contract.ocrConverted = true;
    return this.contractRepository.updateById(contract.id, contract);
  }

  @post('/webhook/hocr-convert')
  @response(200, {
    description: 'Convert contract hocr',
  })
  async convertContractHocr(
    @requestBody() contract: Contracts,
    // eslint-disable-next-line
  ): Promise<any> {
    contract.hocrConverted = true;
    return this.contractRepository.updateById(contract.id, contract);
  }

  @post('/webhook/{clause_type}')
  @response(200, {
    description: 'Get contract document type',
  })
  async getContractDocumentType(
    @param.path.string('clause_type') clauseType: string,
    @requestBody() ocrClause: OcrClause,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  ): Promise<any> {
    const ocrObject = await this.ocrObjectFormatter.format(ocrClause);
    return this.ocrResultRepository.create(ocrObject);
  }
}
