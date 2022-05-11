import {
  inject
} from '@loopback/context';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  param,
  get,
  response,
  post,
  requestBody,
  getModelSchemaRef,
} from '@loopback/rest';
import { CONTENT_TYPE } from '@sourceloop/core';
import { RequestServiceBindings } from '../keys';
import {
  Contracts, HocrResults
} from '../models';
import { FetchClientProvider } from '../providers';
import {
  ContractRepository,
  HocrResultRepository
} from '../repositories';

export class ContractController {
  constructor(
    @inject.getter(RequestServiceBindings.FetchProvider) private readonly requestProvider: FetchClientProvider,
    @repository(ContractRepository) public contractRepository: ContractRepository,
    @repository(HocrResultRepository) public hocrResultRepository: HocrResultRepository
  ) {
  }

  @post('/contract-upload')
  @response(200, {
    description: 'contract file uploaded'
  })
  async uploadContract(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Contracts, {
            title: 'NewContract',
          }),
        },
      },
    })
    contract: Contracts,
  ): Promise<Contracts> {
    return this.contractRepository.create(contract);
  }

  @get('/hocr-convert/{id}')
  @response(200, {
    description: 'hocr file converter'
  })
  async getContractHOCR(
    @param.path.string('id') id: string,
  ): Promise<object> {
    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.sendRequest(`/contract-parser/hocr-converter?contract_name=${contract.contractName}`, 'POST')
    return {
      status: 200,
      message: 'SUCCESS'
    };
  }

  @get('/img-convert/{id}')
  @response(200, {
    description: 'image file converter'
  })
  async convertContractImg(
    @param.path.string('id') id: string,
  ): Promise<object> {
    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.sendRequest(`/contract-parser/img-converter?contract_name=${contract.contractName}`, 'POST')
    return {
      status: 200,
      message: 'SUCCESS'
    };
  }



  @get('/ocr-convert/{id}')
  @response(200, {
    description: 'ocr file converter'
  })
  async convertContractOcr(
    @param.path.string('id') id: string,
  ): Promise<object> {
    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.sendRequest(`/contract-parser/ocr-converter?contract_name=${contract.contractName}`, 'POST')
    return {
      status: 200,
      message: 'SUCCESS'
    };
  }

  @get('/hocr-file/{id}')
  @response(200, {
    description: 'hocr file converter'
  })
  async getAllHOCRByContractName(
    @param.path.string('id') id: string
  ): Promise<HocrResults[]> {
    const contract = await this.contractRepository.findById(id);
    const hocr: HocrResults[] = await this.hocrResultRepository.find({
      where: {
        contractName: contract.contractName
      }
    });
    return hocr;
  }

  @get('/contracts')
  @response(200, {
    description: 'all contract files'
  })
  async getAllContracts(
    @param.filter(Contracts) filter?: Filter<Contracts>,
  ): Promise<Contracts[]> {
    return this.contractRepository.find(filter);

  }
}