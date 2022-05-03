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
} from '../../../lb4-request/dist';
import FormData from 'form-data';
import * as fs from 'fs';
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
    @inject.getter(RequestBindings.FetchProvider) private readonly requestProvider: Getter < IRequest > ,
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
  ): Promise < object > {
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
  ): Promise < object > {
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
  ): Promise < object > {
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
  ): Promise < any > {
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
    @param.filter(Contracts) filter ? : Filter < Contracts > ,
  ): Promise < Contracts[] > {
    return this.contractRepository.find(filter);

  }

  @post('/contract-file')
  @response(200, {
    description: 'contract file upload'
  })
  async uploadContract(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise <any> {
    const provider = await this.requestProvider();

    const form = new multiparty.Form();
    form.parse(request, async (err, fields, files) => {
      if (err) {
        console.log(err)
      }

      const file = files['file'][0];
      console.log(file);
      var formdata = new FormData();
      formdata.append("file", fs.createReadStream(file.path), {
        filename: file.originalFilename,
        contentType: 'application/pdf'
      });

      var requestOptions = {
        method: 'POST',
        body: formdata
      };



      const zz = await provider.send(`/contract-parser/upload-contract`, requestOptions);
      //console.log(zz);
      return zz;
    });
  }
}