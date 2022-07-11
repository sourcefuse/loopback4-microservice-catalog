// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {Filter, repository} from '@loopback/repository';
import {param, get, post, requestBody, getModelSchemaRef} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {RequestServiceBindings} from '../keys';
import {Contracts, HocrResults} from '../models';
import {FetchClientProvider} from '../providers';
import {ContractRepository, HocrResultRepository} from '../repositories';

export class ContractController {
  constructor(
    @inject(RequestServiceBindings.FetchProvider)
    public requestProvider: FetchClientProvider,
    @repository(ContractRepository)
    public contractRepository: ContractRepository,
    @repository(HocrResultRepository)
    public hocrResultRepository: HocrResultRepository,
  ) {}

  @post('/contract-upload', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Create Contract',
      },
    },
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

  @get('/hocr-convert/{id}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Convert Contract to HOCR',
      },
    },
  })
  async getContractHOCR(@param.path.string('id') id: string): Promise<void> {
    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.sendRequest(
      `/contract-parser/hocr-converter?contract_name=${contract.contractName}`,
      'POST',
    );
  }

  @get('/img-convert/{id}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Convert Contract to Image',
      },
    },
  })
  async convertContractImg(@param.path.string('id') id: string): Promise<void> {
    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.sendRequest(
      `/contract-parser/img-converter?contract_name=${contract.contractName}`,
      'POST',
    );
  }

  @get('/ocr-convert/{id}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Convert Contract to OCR',
      },
    },
  })
  async convertContractOcr(@param.path.string('id') id: string): Promise<void> {
    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.sendRequest(
      `/contract-parser/ocr-converter?contract_name=${contract.contractName}`,
      'POST',
    );
  }

  @get('/hocr-file/{id}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Get and create Clause',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(HocrResults)},
          },
        },
      },
    },
  })
  async getAllHOCRByContractName(
    @param.path.string('id') id: string,
  ): Promise<HocrResults[]> {
    const contract = await this.contractRepository.findById(id);
    const hocr: HocrResults[] = await this.hocrResultRepository.find({
      where: {
        contractName: contract.contractName,
      },
    });
    return hocr;
  }

  @get('/contracts', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Get and create Clause',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(Contracts)},
          },
        },
      },
    },
  })
  async getAllContracts(
    @param.filter(Contracts) filter?: Filter<Contracts>,
  ): Promise<Contracts[]> {
    return this.contractRepository.find(filter);
  }
}
