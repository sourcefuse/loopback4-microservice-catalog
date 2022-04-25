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
  requestBody,
  RestBindings,
  Response,
  Request,
  post,
} from '@loopback/rest';
import multiparty from 'multiparty';
import {
  IRequest,
  RequestBindings
} from '@sourceloop/loopback4-fetch-client';
import {
  Contracts,
  HocrResults
} from '../models';
import {
  ContractRepository,
  HocrResultRepository
} from '../repositories';

export class ContractController {
  constructor(
    @inject.getter(RequestBindings.FetchProvider) private readonly requestProvider: Getter<IRequest>,
    @repository(ContractRepository) public contractRepository: ContractRepository,
    @repository(HocrResultRepository) public hocrResultRepository: HocrResultRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response
  ) {
    (this.response as any).setTimeout(1000 * 60 * 20);
  }

  @get('/hocr-convert/{contract_name}')
  @response(200, {
    description: 'hcr file converter'
  })
  async getContractHOCR(
    @param.path.string('contract_name') contract_name: string,
  ): Promise<object> {
    const provider = await this.requestProvider();
    await provider.send(`/contract-parser/hocr-converter?contract_name=${contract_name}`, {
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
    @param.path.string('contract_name') contract_name: string,
  ): Promise<object> {
    const provider = await this.requestProvider();
    await provider.send(`/contract-parser/img-converter?contract_name=${contract_name}`, {
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
    @param.path.string('contract_name') contract_name: string,
  ): Promise<object> {
    const provider = await this.requestProvider();
    await provider.send(`/contract-parser/ocr-converter?contract_name=${contract_name}`, {
      method: 'POST'
    })
    return {
      status: 200,
      message: 'SUCCESS'
    };
  }

  @get('/hocr-file/{contract_name}')
  @response(200, {
    description: 'hcr file converter'
  })
  async getAllHOCRByContractName(
    @param.path.string('contract_name') contract_name: string
  ): Promise<HocrResults[]> {
    const hocr: any = await this.hocrResultRepository.find({
      where: {
        contract_name: contract_name
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

  @post('/contract-file')
  @response(200, {
    description: 'contract file upload'
  })
  async uploadContract(
    @requestBody({
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {
            type: 'object'
          },
        },
      },
    }) request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    const form = new multiparty.Form();
    form.parse(request, (err, fields, files) => {
      if (err) {
        console.log(err)
      }

      console.log(fields)
      console.log(files)
    });
    return {}
  }
}