import {
  Getter,
  inject
} from '@loopback/context';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  param,
  get,
  response
} from '@loopback/rest';
import {
  IRequest,
  RequestBindings
} from '@sourceloop/fetch-client';
import {
  Contracts, HocrResults
} from '../models';
import {
  ContractRepository,
  HocrResultRepository
} from '../repositories';

export class ContractController {
  constructor(
    @inject.getter(RequestBindings.FetchProvider) private readonly getRequestProvider: Getter<IRequest>,
    @repository(ContractRepository) public contractRepository: ContractRepository,
    @repository(HocrResultRepository) public hocrResultRepository: HocrResultRepository
  ) {
  }

  @get('/hocr-convert/{contract_name}')
  @response(200, {
    description: 'hcr file converter'
  })
  async getContractHOCR(
    @param.path.string('contract_name') contractName: string,
  ): Promise<object> {
    const requestProvider = await this.getRequestProvider();
    await requestProvider.send(`/contract-parser/hocr-converter?contract_name=${contractName}`, {
      method: 'POST'
    })
    return {
      status: 200,
      message: 'SUCCESS'
    };
  }

  @get('/img-convert/{contract_name}')
  @response(200, {
    description: 'image file converter'
  })
  async convertContractImg(
    @param.path.string('contract_name') contractName: string,
  ): Promise<object> {
    const requestProvider = await this.getRequestProvider();
    await requestProvider.send(`/contract-parser/img-converter?contract_name=${contractName}`, {
      method: 'POST'
    })
    return {
      status: 200,
      message: 'SUCCESS'
    };
  }



  @get('/ocr-convert/{contract_name}')
  @response(200, {
    description: 'ocr file converter'
  })
  async convertContractOcr(
    @param.path.string('contract_name') contractName: string,
  ): Promise<object> {
    const requestProvider = await this.getRequestProvider();
    await requestProvider.send(`/contract-parser/ocr-converter?contract_name=${contractName}`, {
      method: 'POST'
    })
    return {
      status: 200,
      message: 'SUCCESS'
    };
  }

  @get('/hocr-file/{contract_name}')
  @response(200, {
    description: 'hocr file converter'
  })
  async getAllHOCRByContractName(
    @param.path.string('contract_name') contractName: string
  ): Promise<HocrResults[]> {
    const hocr: HocrResults[] = await this.hocrResultRepository.find({
      where: {
        contractName: contractName
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