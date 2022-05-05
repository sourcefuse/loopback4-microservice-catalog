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
//import multiparty from 'multiparty';
import {
  IRequest,
  RequestBindings
} from '../../../../packages/fetch-client/dist';
// import FormData from 'form-data';
// import * as fs from 'fs';
import {
  Contracts, HocrResults
} from '../models';
import {
  ContractRepository,
  HocrResultRepository
} from '../repositories';

export class ContractController {
  constructor(
    @inject.getter(RequestBindings.FetchProvider) private readonly requestProvider: Getter<IRequest>,
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
    const provider = await this.requestProvider();
    await provider.send(`/contract-parser/hocr-converter?contract_name=${contractName}`, {
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
    const provider = await this.requestProvider();
    await provider.send(`/contract-parser/img-converter?contract_name=${contractName}`, {
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
    const provider = await this.requestProvider();
    await provider.send(`/contract-parser/ocr-converter?contract_name=${contractName}`, {
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

  // @post('/contract-file')
  // @response(200, {
  //   description: 'contract file upload'
  // })
  // async uploadContract(
  //   @requestBody.file() request: Request,
  //   @inject(RestBindings.Http.RESPONSE) response: Response,
  // ): Promise<object> {
  //   const provider = await this.requestProvider();

  //   const form = new multiparty.Form();
  //   form.parse(request, async (err, fields, files) => {
  //     if (err) {
  //       console.log(err)
  //     }

  //     const file = files['file'][0];
  //     console.log(file);
  //     var formdata = new FormData();
  //     formdata.append("file", fs.createReadStream(file.path), {
  //       filename: file.originalFilename,
  //       contentType: 'application/pdf'
  //     });

  //     var requestOptions = {
  //       method: 'POST',
  //       body: formdata
  //     };



  //     const zz = await provider.send(`/contract-parser/upload-contract`, requestOptions);
  //     return zz;
  //   });
  // }
}