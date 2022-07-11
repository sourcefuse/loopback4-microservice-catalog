// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  param,
  get,
  patch,
  requestBody,
  getModelSchemaRef,
  del,
  put,
  post,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {RequestServiceBindings} from '../keys';
import {OcrResults} from '../models';
import {FetchClientProvider} from '../providers';
import {ContractRepository, OcrResultRepository} from '../repositories';
import {CreateClauseData} from '../types';

const basePath = '/clauses/{id}';
export class OcrController {
  constructor(
    @repository(OcrResultRepository)
    public ocrResultRepository: OcrResultRepository,
    @repository(ContractRepository)
    public contractRepository: ContractRepository,
    @inject.getter(RequestServiceBindings.FetchProvider)
    private readonly requestProvider: FetchClientProvider,
  ) {}

  @post('/get-clause-data', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Get Clause Data',
      },
    },
  })
  async getContractData(
    @requestBody() clauseData: CreateClauseData,
  ): Promise<void> {
    await this.requestProvider.sendRequest(
      `/contract-parser/${clauseData.clauseType}?contract_name=${clauseData.contractName}`,
      'POST',
    );
  }

  @get('/clauses/{contract_id}', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of OcrResults model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {type: 'array', items: getModelSchemaRef(OcrResults)},
          },
        },
      },
    },
  })
  async getContractClauses(
    @param.path.string('contract_id') contractId: string,
  ): Promise<OcrResults[]> {
    return this.ocrResultRepository.find({
      where: {
        contractId: contractId,
      },
    });
  }

  @patch('/clauses', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Clauses PATCH success',
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'array',
            items: getModelSchemaRef(OcrResults, {partial: true}),
          },
        },
      },
    })
    clauses: [Pick<OcrResults, 'id' | 'text' | 'confidenceLevel'>],
  ): Promise<void> {
    await Promise.all(
      clauses.map(item => this.ocrResultRepository.updateById(item.id, item)),
    );
  }

  @patch(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'OcrResults PATCH success',
      },
    },
  })
  async updateClauseById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(OcrResults, {partial: true}),
        },
      },
    })
    clause: Omit<OcrResults, 'id'>,
  ): Promise<void> {
    return this.ocrResultRepository.updateById(id, clause);
  }

  @put(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'OcrResults PUT success',
      },
    },
  })
  async replaceClauseById(
    @param.path.string('id') id: string,
    @requestBody() clause: OcrResults,
  ): Promise<void> {
    return this.ocrResultRepository.replaceById(id, clause);
  }

  @del(basePath, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'OcrResults DELETE success',
      },
    },
  })
  async deleteClauseById(@param.path.string('id') id: string): Promise<void> {
    return this.ocrResultRepository.deleteById(id);
  }
}
