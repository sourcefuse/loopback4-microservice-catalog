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
  response,
  Request,
  RestBindings
} from '@loopback/rest';
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
    @repository(HocrResultRepository) public hocrResultRepository: HocrResultRepository,
    @inject(RestBindings.Http.REQUEST) private request: Request
  ) {
  }

  @get('/hocr-convert/{contract_name}')
  @response(200, {
    description: 'hcr file converter'
  })
  async getContractHOCR(
    @param.path.string('contract_name') contractName: string,
  ): Promise<object> {
    await this.requestProvider.post(`/contract-parser/hocr-converter?contract_name=${contractName}`)
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

    await this.requestProvider.post(`/contract-parser/img-converter?contract_name=${contractName}`)
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

    await this.requestProvider.post(`/contract-parser/ocr-converter?contract_name=${contractName}`)
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